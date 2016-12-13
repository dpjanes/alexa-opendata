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

const errors = require("iotdb-errors");
const iotdb_format = require("iotdb-format");

const Q = require('q');

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

/* --- this is the request flow --- */

/**
 *  This handles Alexa session
 *
 "session": {
    "new": true,
    "sessionId": "amzn1.echo-api.session.7ca859a1-b687-4240-adeb-8477453f7b68",
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.c054b062-0579-4b0d-9aae-0a5d1cfbc577"
    },
    "user": {
      "userId": "amzn1.ask.account.XXXX",
      "accessToken": "XXXX"
    }
  },
 */
const __alexa_session_validate = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.is_new_session = _.d.first(self.body, "/session/new", false);

    return done(null, self);
};
const _alexa_session_validate = Q.denodeify(__alexa_session_validate);

/**
 *  This handles HomeStar user
 */
const __alexa_session_runner = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    return done(null, self);
    /*
    // get bearer token
    self.bearer_token = _.d.get(self.body, "session/user/accessToken");
    if (!_.is.String(self.bearer_token)) {
        return done(new errors.NotAuthorized("no access token"));
    }

    // validate and get consumer, user etc.
    homestar.db.consumer.verify_bearer(self.bearer_token, function (error, resultd) {
        if (error) {
            return done(new errors.NotAuthorized(_.error.message(error)));
        }

        self.user = resultd.user;
        self.consumer = resultd.consumer;

        self.runner_id = resultd.consumer.id;
        self.runner_code = self.runner_id.replace(/^.*:/, '')
        // self.runner_id = "ZYeoe1iA";

        self.user_id = resultd.user.id;
        self.user_code = self.user_id.replace(/^.*:/, '')

        return done(null, self);
    });
    */
};
const _alexa_session_runner = Q.denodeify(__alexa_session_runner);

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
        self.where = _.d.get(self.body, "/request/intent/slots/Where/value") || null;
        self.what = _.d.get(self.body, "/request/intent/slots/What/value") || null;

        self.end_session = self.is_new_session;
        break;

    case "LaunchRequest":
        self.response = "OK, ask me where something is";
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
            } else {
                self.response = `found ${self.itemds.length} place named ${self.name}`
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
 *  This does the work of processing an Alexa request
 */
const _alexa_handle = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    Q(self)
        .then(_alexa_session_validate)
        .then(_alexa_session_runner)
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
            console.log("#", "error", _.error.message(error));
            console.log(error.stack);

            done(error);
        })
};

/**
 */
exports.handle = _alexa_handle;