/*
 *  components/AlexaAuthorize.jsx
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-01
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import C from '../constants';
import * as firebase from 'firebase';

import { openAuth, listenToAuth } from '../actions/auth';
import store from '../store'

import Header from './Header';

class AlexaAuthorize extends React.Component {
	constructor() {
		super();

        /*
        this.lines = []
        window.console.log = (...rest) => {
            this.lines.push(rest.join(" "));
            this.forceUpdate();
        };
        console.log = window.console.log;
        */

		this.authorize = this.authorize.bind(this);
		this.sign_in = this.sign_in.bind(this);

        /*
        console.log(navigator.userAgent);

        setInterval(() => {
            console.log(".");
        }, 10000);
        */
	};

	componentWillMount() {
        store.dispatch(listenToAuth(false));
	};

	sign_in(event) {
		event.preventDefault();
		this.props.openAuth();
	}

	authorize(event) {
		event.preventDefault();

		const props = this.props;
		const query = this.props.location.query;

		firebase.auth().currentUser.getToken(true).then(token => {
			window.location = `/authorize/commit?token=${token}&client_id=${query.client_id}&response_type=${query.response_type}&state=${query.state}`;
		}).catch(error => {
			alert(`something went wrong: ${error.message}`)
		});
	};

	render() {
		const props = this.props;
		const query = this.props.location.query;

        let result = null;
        if (navigator.userAgent.indexOf("PitanguiBridge") > -1) {
            result = (
                <div>
                <Header />
                <div className="row">
                <h1>Alexa Authentication Page</h1>
                <p>
                Many apologies, but this Alexa Skill must be enabled from 
                the desktop in a standard web browser due to Google security controls.
                </p>

                </div>
                </div>
            );
        } else if (props.auth.status === C.AUTH_LOGGED_IN) {
            result = (
                <div>
                <Header />
                <div className="row">
                <h1>Alexa Authentication Page</h1>
                <p>
                Press Authorize to allow Alexa to manipulate the data
                displayed for this account.
                </p>

                <button className="btn" onClick={this.authorize}>Authorize Alexa</button>

                </div>
                </div>
            );
        } else {
            result = (
                <div>
                <Header />
                <div className="row">
                <h1>Alexa Authentication Page</h1>
                <p>
                Sign in using Google First.
                </p>

                <button className="btn" onClick={this.sign_in}>Sign In</button>

                </div>
                </div>
            )
		}

        return result;
	};

};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
};

const mapDispatchToProps = {
	openAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlexaAuthorize);


/*

			<table className="table">
			<thead>
			<tr>
			<th>What</th>
			<th>Got</th>
			<th>Expected</th>
			</tr>
			</thead>
			<tbody>

			<tr>
			<td>client_id</td>
			<td>{query.client_id}</td>
			<td>alexa-opendata</td>
			</tr>

			<tr>
			<td>token</td>
			<td>{query.response_type}</td>
			<td>token</td>
			</tr>

			<tr>
			<td>state</td>
			<td>{query.state}</td>
			<td>(some value)</td>
			</tr>

			<tr>
			<td>user id</td>
			<td>{props.auth.uid}</td>
			<td>(some value)</td>
			</tr>

			</tbody>
			</table>


			<button className="btn" onClick={() => this.authorize()}>Authorize</button>


			</div>
			</div>
    	);
	}
                <pre>{this.lines.join("\n")}</pre>
	*/
