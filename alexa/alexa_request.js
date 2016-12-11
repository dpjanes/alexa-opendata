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
        "shouldEndSession": true
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

    self.name = _.d.get(self.body, "/request/intent/slots/Where/value") || null;
    self.theme_part = _.d.get(self.body, "/request/intent/slots/What/value") || null;

    done(null, self);
};
const _alexa_request_parse = Q.denodeify(__alexa_request_parse);

/**
 */
const __execute = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (self.name && self.theme_part) {
        start
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
            .then(self => done(null, self))
            .catch(error => done(error))
    } else if (self.name) {
        start
            .then(self => _.d.add(self, "title", `<b>${self.name}</b>`))
            .then(lib.query_name)
            .then(lib.filter_ll)
            .then(lib.sort_by_distance)
            .then(lib.uniq)
            .then(lib.limit)
            .then(lib.firebase.update_places)
            .then(lib.firebase.update_title)
            .then(self => done(null, self))
            .catch(error => done(error))
    } else if (self.theme_part) {
        start
            .then(self => _.d.add(self, "title", `<b>${self.theme_part}</b> near me`))
            .then(lib.query_theme_part)
            .then(lib.filter_ll)
            .then(lib.sort_by_distance)
            .then(lib.uniq)
            .then(lib.limit)
            .then(lib.firebase.update_places)
            .then(lib.firebase.update_title)
            .then(self => done(null, self))
            .catch(error => done(error))
    } else {
        done(new Error("expected Where or What"));
    }
};
const _execute = Q.denodeify(__execute);

/**
 *  This does the work of processing an Alexa request
 */
const _alexa_handle = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    Q(self)
        .then(_alexa_session_validate)
        .then(_alexa_session_runner)
        .then(_alexa_request_parse)
        .then(_execute)
        .then((self) => {
            done(null, iotdb_format.format(response_templated, {
                title: success_title,
                message: success_message,
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
