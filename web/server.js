/*
 *  server.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-17
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  This is the common code for server-*.js
 */

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev';

const assert = require("assert");

const iotdb = require("iotdb");
const _ = iotdb._;

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const project_config = require("../config.json");

const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, "../firebase-admin.json")),
    databaseURL: project_config.firebase.databaseURL,
})

const firebase = require('firebase');
firebase.initializeApp(project_config.firebase);

const db = firebase.database();

/**
 *  The "original_token" is a short-lived JWT provided  by firebase. 
 *  The "final_token" is a long-lived JWT that we've signed ourselves
 *  and will be passed back to alexa for session management.
 */
const authorize_by_login = (request, response) => {
    const original_token = request.query.token;
    if (!original_token) {
        return response.status(400).send("ERROR: expected: token")
    }

    const client_id = request.query.client_id;
    if (!client_id) {
        return response.status(400).send("ERROR: expected: client_id")
    } else if (client_id !== project_config.alexa.client_id) {
        return response.status(400).send(`ERROR: expected client_id to be ${project_config.alexa.client_id}`);
    }

    const response_type = request.query.response_type;
    if (!response_type) {
        return response.status(400).send("ERROR: expected: response_type")
    } else if (response_type !== "token") {
        return response.status(400).send("ERROR: expected response_type to be 'token'")
    }

    const state = request.query.state;
    if (!state) {
        return response.send("ERROR: expected: state")
    }

    admin.auth()
        .verifyIdToken(original_token)
        .then(decoded_token => {
            jwt.sign({ "uid": decoded_token.uid }, project_config.jwtSecret, {}, (error, final_token) => {
                if (error) {
                    return response.status(400).send(`ERROR: could not make JWT: ${error.message}`)
                }

                const return_url =
                    project_config.alexa.redirect +
                    "#state=" + state +
                    "&access_token=" + final_token +
                    "&token_type=Bearer";

                return response.redirect(return_url);
            })
        })
        .catch(error => {
            return response.status(400).send(`ERROR: could not verify token: ${error.message}`)
        });
};

const authorize_by_code = (request, response) => {
    console.log("-", authorize_by_code);

    const client_id = request.query.client_id;
    if (!client_id) {
        return response.status(400).send("ERROR: expected: client_id")
    } else if (client_id !== project_config.alexa.client_id) {
        return response.status(400).send(`ERROR: expected client_id to be ${project_config.alexa.client_id}`);
    }

    const response_type = request.query.response_type;
    if (!response_type) {
        return response.status(400).send("ERROR: expected: response_type")
    } else if (response_type !== "token") {
        return response.status(400).send("ERROR: expected response_type to be 'token'")
    }

    const state = request.query.state;
    if (!state) {
        return response.status(400).send("ERROR: expected: state")
    }

    const code = request.query.code;
    if (!code) {
        return response.status(400).send("ERROR: expected: token")
    }

    const ref = db.ref(`tokens/${code.toLowerCase()}`);
    ref.once("value")
        .then(snapshot => {
            const d = snapshot.val();

            assert.ok(_.is.String(d.station));
            assert.ok(_.is.Timestamp(d.when));

            ref.remove();

            const delta = new Date() - new Date(d.when);
            if (delta > 3 * 60 * 1000) {
                return response.status(400).send(`code expired: trying getting another code`);
            }

            jwt.sign({ "uid": d.station }, project_config.jwtSecret, {}, (error, final_token) => {
                if (error) {
                    return response.status(400).send(`ERROR: could not make JWT: ${error.message}`)
                }

                const return_url =
                    project_config.alexa.redirect +
                    "#state=" + state +
                    "&access_token=" + final_token +
                    "&token_type=Bearer";

                return response.redirect(return_url);
            })
        });
};

const authorize_token = (request, response) => {
    const original_token = request.query.token;
    if (!original_token) {
        return response.send("ERROR: expected: token")
    }

    admin.auth()
        .verifyIdToken(original_token)
        .then(tokend => {
            if (!tokend.email) {
                return response.status(400).send("ERROR - no email address associated with this account");
            }
            if (!tokend.email_verified) {
                return response.status(400).send("ERROR - the email address has not been verified yet");
            }

            const token = _.random.id(6)
            const ref = db.ref(`tokens/${token}`);

            ref.set({
                token: token,
                when: _.timestamp.make(),
                station: tokend.uid,
            }, (error) => {
                if (error) {
                    return response.status(400).send("ERROR:" + _.error.message(error));
                }

                return response.send(token);
            });
        })
        .catch(error => {
            return response.status(400).send(`ERROR: could not verify token: ${error.message}`)
        });
};


const server = (_initd) => {
    const initd = _.d.compose.shallow(_initd, {
        use_webpack: false,
        host: "0.0.0.0",
        port: 22300,
    })
    
    const app = express();

    if (initd.use_webpack) {
        console.log("-", "using webpack");

        const compiler = webpack(config);

        app.use(require('webpack-dev-middleware')(compiler, {
            stats: {
                chunks: false,
                colors: true
            },
            publicPath: config.output.publicPath
        }));

        app.use(require('webpack-hot-middleware')(compiler));
    }

    app.use(express.static(path.join(__dirname, 'static')));

    app.use("/authorize/commit", authorize_by_login);
    app.use("/authorize/token", authorize_token);
    app.use("/authorize/commit-code", authorize_by_code);

    app.get('*', (request, response) => {
        response.sendFile(path.join(__dirname, 'static', 'index.html'));
    });

    app.listen(initd.port, initd.host, (error) => {
        if (error) {
            console.log("#", _.error.message(error));
            console.log(error.stack);
            return;
        }

        console.log('-', `Listening at http://${initd.host}:${initd.port} `);
    });
}

/**
 *  API
 */
exports.server = server;
