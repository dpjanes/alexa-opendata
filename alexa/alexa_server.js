/*
 *  alexa_server.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-11
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  Set up a HTTP server that receives
 *  HTTP requests, processes them (i.e.
 *  manipulates Things) and sends a response
 */

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const express = require('express');
const body_parser = require('body-parser')

const Q = require('q');

const alexa_request = require('./alexa_request');

/* --- this is the setup flow --- */

/**
 *  This just sets up express
 */
const _express_setup = function(self, done) {
    self = _.d.clone.shallow(self);

    const app = express();

    app.use(body_parser.json());

    app.listen(22200, () => {
        self.app = app;
        done(null, self);
    });
};
const _express_setup = Q.denodeify(_express_setup);

/**
 *  This monitors all requests
 */
const _app_monitor = function(self, done) {
    self = _.d.clone.shallow(self);

    self.app.use((request, response, next) => {
        console.log("-", "connection");
        console.log(" method:", request.method);
        console.log(" path:", request.path);
        console.log(" path:", request.path);
        console.log(" headers:");
        console.log(request.headers);
        console.log(" body:");
        console.log(JSON.stringify(request.body, null, 2));
        console.log("---");
        console.log();

        next();
    });

    done(null, self);
};
const _app_monitor = Q.denodeify(_app_monitor);

/**
 *  This handles POST requests from AWS
 */
const _app_alexa = function(_self, done) {
    const self = _.d.clone.shallow(_self);

    self.app.use("/request", (request, response) => {
        alexa_request.handle(_.d.compose.shallow(self, {
            body: request.body,
        }), (error, responsed) => {
            if (error) {
                return response.status(400).send(_.error.message(error));
            } 

            response.send(JSON.stringify(responsed, null, 2));
        });
    });

    done(null, self);
};
const _app_alexa = Q.denodeify(_app_alexa);

/**
 */
const __database_setup = function(self, done) {
    const self = _.d.clone.shallow(_self);
};
const _database_setup = Q.denodeify(__database_setup);

/*
 */
const __firebase_setup = function(self, done) {
    const self = _.d.clone.shallow(_self);
}
const _firebase_setup = Q.denodeify(__firebase_setup);

const setup = function() {
    Q({})
        .then(_database_setup)
        .then(_firebase_setup)
        .then(_express_setup)
        .then(_app_monitor)
        .then(_app_alexa)
        .then(() => {
            console.log("-", "app running");
        })
        .catch((error) => {
            console.log("#", "cannot start app:", _.error.message(error))
        })
};

/**
 *
 */
exports.setup = setup;
