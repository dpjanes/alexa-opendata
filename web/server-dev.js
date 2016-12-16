/*
 *  server-dev.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-01
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  Process a single Alexa HTTP request.
 */

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev';

const jwt = require("jsonwebtoken");
const project_config = require("../config.json");

const admin = require("firebase-admin");
const admin_app = admin.initializeApp({
    credential: admin.credential.cert("../firebase-admin.json"),
    databaseURL: project_config.firebase.databaseURL,
})

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
	stats: {
		chunks: false,
		colors: true
	},
	publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('static'));

/**
 *  The "original_token" is a short-lived JWT provided  by firebase. 
 *  The "final_token" is a long-lived JWT that we've signed ourselves
 *  and will be passed back to alexa for session management.
 */
app.use("/authorize-commit", (request, response) => {
    const original_token = request.query.token;
	if (!original_token) {
		return response.send("ERROR: expected: token")
	}

    const client_id = request.query.client_id;
	if (!client_id) {
		return response.send("ERROR: expected: client_id")
	} else if (client_id !== project_config.alexa.client_id) {
		return response.send(`ERROR: expected client_id to be ${project_config.alexa.client_id}`);
    }

    const response_type = request.query.response_type;
	if (!response_type) {
		return response.send("ERROR: expected: response_type")
	} else if (response_type !== "token") {
		return response.send("ERROR: expected response_type to be 'token'")
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
                    return response.send(`ERROR: could not make JWT: ${error.message}`)
                }

                const return_url =
                    project_config.alexa.redirect +
                    "#state=" + state +
                    "&access_token=" + final_token +
                    "&token_type=Bearer";

                return response.redirect(return_url);
                // return response.send(`OK: ${final_token}`)
            })
        })
        .catch(error => {
            return response.send(`ERROR: could not verify token: ${error.message}`)
        });
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.listen(22300, '0.0.0.0', (err) => {
	if (err) {
		console.log("#", err);
		return;
	}
	console.log('-','Listening at http://localhost:22300');
});
