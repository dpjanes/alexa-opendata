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

const path = require('path');

const express = require('express');
const body_parser = require('body-parser')

const Q = require('q');

const alexa_request = require('./alexa_request');

const lib = require("../lib")

/* --- this is the setup flow --- */

/**
 *  This just sets up express
 */
const __express_setup = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    const app = express();

    app.use(body_parser.json({
        verify: (request, response, buffer, encoding) => {
            if (buffer && buffer.length) {
                request.raw_body = buffer.toString(encoding || 'utf8');
            }
        }
    }));

    app.listen(self.port, self.host, (error) => {
        self.app = app;
        done(null, self);
    });
};
const _express_setup = Q.denodeify(__express_setup);

/**
 *  This monitors all requests
 */
const __app_monitor = (_self, done) => {
    const self = _.d.clone.shallow(_self);

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
const _app_monitor = Q.denodeify(__app_monitor);

/**
 *  This handles POST requests from AWS
 */
const __app_alexa = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.app.use("/request", (request, response) => {
        alexa_request.handle(_.d.compose.shallow(self, {
            body: request.body,
            raw_body: request.raw_body,
            headers: request.headers,
        }), (error, responsed) => {
            if (error) {
                return response.status(400).send(_.error.message(error));
            } 

            response.send(JSON.stringify(responsed, null, 2));
        });
    });

    done(null, self);
};
const _app_alexa = Q.denodeify(__app_alexa);

const setup = () => {
    Q({
        dst_folder: path.join(__dirname, "..", "dst"),
        database: lib.database(),

        config: require("../config.json"),

        // station: "xhP0Y6lsKOW0OZXHBMEPnFvmKZw2",

        n: 10,
        latitude: 43.736342,
        longitude: -79.419222,

        fuzzy: true,

        host: "0.0.0.0",
        port: 22200,
    })
        .then(lib.load_database)
        .then(lib.firebase.connect)
        .then(_express_setup)
        .then(_app_monitor)
        .then(_app_alexa)
        .then(self => {
            console.log('-', `Listening at http://${self.host}:${self.port} `);
        })
        .catch((error) => {
            console.log("#", "cannot start app:", _.error.message(error))
            console.log(error.stack);
        })
};

/**
 *
 */
exports.setup = setup;

setup();
