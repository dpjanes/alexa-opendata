/*
 *  alexa_request.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-11
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  Process a single Alexa HTTP request.
 */

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const path = require("path");
const url = require("url");
const assert = require("assert");
const crypto = require("crypto");

const errors = require("iotdb-errors");
const iotdb_format = require("iotdb-format");

const Q = require('q');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const cert_tools = require('openssl-cert-tools');

const logger = iotdb.logger({
    name: 'alexa-opendata',
    module: 'alexa/alexa_request',
});

const lib = require("../lib")

const success_title = "Done!";
const success_message = "OK, done!";

const nothing_title = "There was an issue";
const nothing_message = "I didn't find a Thing that could do this";

const response_templated = {
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "{{ message }}",
        },
        "card": {
            "type": "Simple",
            "title": "{{ title }}",
            "content": "{{ message }}",
        },
        "shouldEndSession": true,
    },
    "sessionAttributes": {}
};

const link_account = {
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "You must have a Hey Toronto account to use this skill. Please use the Alexa desktop website to link your Amazon account with your Hey Toronto Account."
        },
        "card": {
             "type": "LinkAccount"
        },
        "shouldEndSession": true,
    },
    "sessionAttributes": {}
};

/* --- this is the request flow --- */

/**
 *  This handles the signature chain header URL validation
 *
 *  signaturecertchainurl: 'https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem',
 */
const __validate_signature_chain = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.signature_chain_url = _.d.first(self.headers, "signaturecertchainurl")
    if (!_.is.String(self.signature_chain_url)) {
        return done(new errors.Invalid("no signaturecertchainurl"));
    }

    const urlp = url.parse(self.signature_chain_url)

    if (urlp.protocol !== "https:") {
        return done(new errors.Invalid("signaturecertchainurl: expected protocol=https"));
    }
    if (urlp.host !== "s3.amazonaws.com") {
        return done(new errors.Invalid("signaturecertchainurl: expected host=s3.amazonaws.com"));
    }
    if (urlp.port && (urlp.port !== "443")) {
        return done(new errors.Invalid("signaturecertchainurl: expected port=null|443"));
    }
    if (!urlp.path.startsWith("/echo.api/")) {
        return done(new errors.Invalid("signaturecertchainurl: expected path to start with /echo.api/"));
    }

    return done(null, self);
};
const _validate_signature_chain = Q.denodeify(__validate_signature_chain);

const certd = {}

/**
 *  This will download the signature chain URL (if it isn't already)
 */
const __download_signature_chain = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.signature_chain = certd[self.signature_chain_url];
    if (self.signature_chain) {
        return done(null, self);
    }

    unirest
        .get(self.signature_chain_url)
        .end(result => {
            if (result.error) {
                return done(result.error);
            } 

            self.signature_chain = result.body;

            cert_tools.getCertificateInfo(result.body, (error, data) => {
                if (error) {
                    return done(error);
                }

                if (data.subject.CN.indexOf('echo-api.amazon.com') === -1) {
                    return done(new errors.Invalid("certificate: expected to see echo-api.amazon.com in subject.CN"));
                }

                if (data.remainingDays < 1) {
                    return done(new errors.Invalid("certificate: expired"));
                }

                certd[self.signature_chain_url] = self.signature_chain;
            
                return done(null, self);
            })
        })
};
const _download_signature_chain = Q.denodeify(__download_signature_chain);

/**
 *  This handles the signature header validation
 *
 *  signature: '...'
 */
const __validate_signature = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.signature = _.d.first(self.headers, "signature")
    if (_.is.Empty(self.signature)) {
        return done(new errors.Invalid("no signature"));
    }
    if (!_.is.String(self.signature)) {
        return done(new errors.Invalid("invalid signature type"));
    } 

    const verifier = crypto.createVerify('RSA-SHA1');
    verifier.update(self.raw_body);

    if (!verifier.verify(self.signature_chain, self.signature, "base64")) {
        return done(new errors.Invalid("the signature did not validate"));
    }

    // console.log("-", "SIGNATURE VALIDATED");

    return done(null, self);
};
const _validate_signature = Q.denodeify(__validate_signature);

/**
 *  This handles the timestamp
 */
const __validate_timestamp = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    const timestamp = _.d.first(self.body, "/request/timestamp", null);
    if (!_.is.String(timestamp)) {
        return done(new errors.Timestamp("no timestamp"));
    }

    const dt_now = new Date()
    const dt_timestamp = new Date(timestamp)
    const delta = Math.abs(dt_now - dt_timestamp);

    if (delta > (5 * 60 * 1000)) {
        return done(new errors.Timestamp("timestamp out of date: delta=" + delta));
    }

    return done(null, self);
};
const _validate_timestamp = Q.denodeify(__validate_timestamp);

/**
 *  This handles Alexa session
 */
const __alexa_session_validate = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.is_new_session = _.d.first(self.body, "/session/new", false);

    return done(null, self);
};
const _alexa_session_validate = Q.denodeify(__alexa_session_validate);

/**
 *  This handles the user that has paired with this echo
 */
const __decode_access_token = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.access_token = _.d.get(self.body, "session/user/accessToken");
    if (!_.is.String(self.access_token)) {
        return done(new errors.NotAuthorized("no access token"));
    }

    jwt.verify(self.access_token, self.config.jwtSecret, {}, (error, d) => {
        if (error) {
            return done(error);
        }

        assert(d.uid, "expected the token to encode a UID");

        self.station = d.uid;
        // console.log("-", "SETTING STATION TO", self.station);

        return done(null, self);
    })
};
const _decode_access_token = Q.denodeify(__decode_access_token);

/**
 *  This parses an Alexa request
 */
const __alexa_request_parse = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    console.log("========");
    console.log(JSON.stringify(self.body, null, 2));
    console.log("========");

    self.response = "Sorry, I don't know how to handle this request";
    self.end_session = true;

    switch (_.d.get(self.body, "/request/type")) {
    case "IntentRequest":
        switch (_.d.get(self.body, "/request/intent/name")) {
        case "AMAZON.HelpIntent":
            self.response = "Ask me a question like 'where are skating rinks near the CN Tower' or 'where is the Eaton Centre'";
            self.end_session = true;
            break;

        case "AMAZON.CancelIntent":
        case "AMAZON.StopIntent":
            self.response = "OK, goodbye";
            self.end_session = true;
            break;

        default:
            self.where = _.d.get(self.body, "/request/intent/slots/Where/value") || null;
            self.what = _.d.get(self.body, "/request/intent/slots/What/value") || null;
            // self.end_session = self.is_new_session;
            break;
        }

        break;

    case "LaunchRequest":
        self.response = "Ask Hey Toronto a question like 'where are skating rinks near the CN Tower' or 'where is the Eaton Centre'";
        // self.response = "OK, ask me where something is";
        self.end_session = false;
        break;

    case "SessionEndedRequest":
        self.response = "OK, bye";
        self.end_session = true;
        break;
    }

    done(null, self);
};
const _alexa_request_parse = Q.denodeify(__alexa_request_parse);

/**
 */
const __execute_where_what = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (!(self.what && self.where)) {
        return done(null, self);
    }

    self.name = self.where;
    self.theme_part = self.what;

    Q(self)
        .then(self => _.d.add(self, "title", `<b>${self.theme_part}</b> near <b>${self.name}</b>`))
        .then(lib.query_name)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.make_result_center)
        .then(lib.query_theme_part)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.uniq)
        .then(lib.limit)
        .then(lib.firebase.update_places)
        .then(lib.firebase.update_title)
        .then(self => {
            if (self.itemds.length === 0) {
                self.response = `found nothing for ${self.theme_part} near ${self.name}`
            } else if (self.itemds.length === 1) {
                self.response = `found one place for ${self.theme_part} near ${self.name}`
            } else {
                self.response = `found ${self.itemds.length} places for ${self.theme_part} near ${self.name}`
            }

            // this is set by `make_result_center`
            if (self.itemd && self.itemd.streetAddress) {
                self.response += ` at ${self.itemd.streetAddress}`
            }

            done(null, self)
        })
        .catch(error => {
            if (error instanceof errors.NotFound) {
                self.response = `I did not find ${self.name}`
                return done(null, self);
            }

            done(error)
        })
        
};
const _execute_where_what = Q.denodeify(__execute_where_what);

/**
 */
const __execute_where = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (!(!self.what && self.where)) {
        return done(null, self);
    }

    self.name = self.where;

    Q(self)
        .then(self => _.d.add(self, "title", `<b>${self.name}</b>`))
        .then(lib.query_name)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.uniq)
        .then(lib.limit)
        .then(lib.firebase.update_places)
        .then(lib.firebase.update_title)
        .then(self => {
            if (self.itemds.length === 0) {
                self.response = `found nothing named ${self.name}`
            } else if (self.itemds.length === 1) {
                self.response = `found one place named ${self.name}`
                
                const itemd = self.itemds[0];
                if (itemd.streetAddress) {
                    self.response += ` at ${itemd.streetAddress}`
                }
            } else {
                self.response = `found ${self.itemds.length} place named ${self.name}`
                
                const itemd = self.itemds[0];
                if (itemd.streetAddress) {
                    self.response += `. The first is at ${itemd.streetAddress}`
                }
            }

            done(null, self)
        })
        .catch(error => done(error))
};
const _execute_where = Q.denodeify(__execute_where);

/**
 */
const __execute_what = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (!(self.what && !self.where)) {
        return done(null, self);
    }

    self.theme_part = self.what;

    Q(self)
        .then(self => _.d.add(self, "title", `<b>${self.theme_part}</b> near me`))
        .then(lib.query_theme_part)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.uniq)
        .then(lib.limit)
        .then(lib.firebase.update_places)
        .then(lib.firebase.update_title)
        .then(self => {
            if (self.itemds.length === 0) {
                self.response = `found nothing for ${self.theme_part}`
            } else if (self.itemds.length === 1) {
                self.response = `found one place for ${self.theme_part}`
            } else {
                self.response = `found ${self.itemds.length} places for ${self.theme_part}`
            }

            done(null, self)
        })
        .catch(error => done(error))
};
const _execute_what = Q.denodeify(__execute_what);

/**
 */
const _alexa_handle = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.raw_body, "expected self.raw_body")
    assert.ok(self.body, "expected self.body")
    assert.ok(self.headers, "expected self.headers")

    Q(self)
        .then(_validate_signature_chain)
        .then(_download_signature_chain)
        .then(_validate_signature)
        .then(_validate_timestamp)
        .then(_alexa_session_validate)
        .then(_decode_access_token)
        .then(_alexa_request_parse)
        .then(_execute_where_what)
        .then(_execute_where)
        .then(_execute_what)
        .then((self) => {
            const templated = _.d.clone.deep(response_templated);
            _.d.set(templated, "/response/shouldEndSession", self.end_session);

            done(null, iotdb_format.format(templated, {
                title: self.response,
                message: self.response,
            }));
        })
        .catch(error => {
            if (error instanceof errors.NotAuthorized) {
                return done(null, link_account);
            }

            console.log("#", "error", _.error.message(error));
            console.log(error.stack);

            done(error);
        })
};

/**
 */
exports.handle = _alexa_handle;
