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
const __alexa_session_validate = function(self, done) {
    self = _.d.clone.shallow(self);

    return done(null, self);
};
const _alexa_session_validate = Q.denodeify(__alexa_session_validate);

/**
 *  This handles HomeStar user
 */
const __alexa_session_runner = function(self, done) {
    self = _.d.clone.shallow(self);

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
  "request": {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.4c98f240-0ded-4e12-a4a3-223b7df17c81",
    "timestamp": "2016-04-26T18:24:05Z",
    "intent": {
      "name": "HomeStarFirstIntent",
      "slots": {
        "Action": {
          "name": "Action",
          "value": "turn on"
        },
        "Thing": {
          "name": "Thing",
          "value": "lights"
        }
      }
    }
  }
 */
const __alexa_request_parse = function(self, done) {
    self = _.d.clone.shallow(self);

    console.log("========");
    console.log(JSON.stringify(self.body, null, 2));
    console.log("========");

    const what = _.d.get(self.body, "/request/intent/slots/What/value");
    if (what) {
        self.what = what;
    }

    const where = _.d.get(self.body, "/request/intent/slots/Where/value");
    if (where) {
        self.where = where;
    }

    done(null, self);
};
const _alexa_request_parse = Q.denodeify(__alexa_request_parse);

/**
 */
const __execute = function(self, done) {
    self = _.d.clone.shallow(self);

    done(null, self);
};
const _execute = Q.denodeify(__execute);

/**
 *  This does the work of processing an Alexa request
 */
const _alexa_handle = function(self, done) {
    self = _.d.clone.shallow(self);

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
            console.log(error.trace);

            done(error);
        })
};

/**
 */
exports.handle = _alexa_handle;
