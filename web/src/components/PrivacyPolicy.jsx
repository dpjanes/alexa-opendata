/*
 *  components/PrivacyPolicy.jsx
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-16
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

import { listenToAuth } from '../actions/auth';
import store from '../store'

import Header from './Header';

class PrivacyPolicy extends React.Component {
	constructor() {
		super();
	};

	componentWillMount() {
        store.dispatch(listenToAuth(false));
	};


	render() {
		return (
            <div>
			<Header />
			<div className="row">
			<h1>Privacy Policy</h1>
            <p className="lead">
            We will not misuse, sell, or exploit any information provided to us.
            We only use your login information to control this web app
            from your Alexa account.
            Any information provided to us will not be shared with any other company or 3rd Party.
            </p>
            <p className="lead">
            The only information retained by us is your basic account info,
            the current map settings,
            and the results of your latest query.
            </p>
            <p className="lead">
            Note however that our databse <b>does not</b> provide any privacy
            with regards to your latest query. Anyone with the URL of the
            map webpage for your account can view your latest query (in real time!).
            This is by design, so that you do not need to be logged into
            your account in order for a map to be controlled by Alexa.
            </p>
            <p className="lead">
            Please send any concerns, questions, etc. to&nbsp;
            <a href="mailto:alexa-opendata@davidjanes.com">alexa-opendata@davidjanes.com</a>
            </p>
            </div>
            </div>
            );
	}
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);
