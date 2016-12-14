/*
 *  xxx.js
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openAuth, logoutUser } from '../actions/auth';
import C from '../constants';

class Auth extends Component {
	getJSX(props) {
		switch (props.auth.status) {
			case C.AUTH_LOGGED_IN: return (
				<div>
				<span>Logged in as {props.auth.username}.</span>
				{" "}<button className="btn btn-warning" onClick={props.logoutUser}>Log out</button>
				</div>
			);
			case C.AUTH_AWAITING_RESPONSE: return (
				<div>
				<button className="btn btn-primary" disabled>authenticating...</button>
				</div>
			);
			default: return (
				<div>
				<button className="btn btn-primary" onClick={props.openAuth}>Log in</button>
				</div>
			);
		}
	}
	render() {
		return this.getJSX(this.props);
	}
}

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
	openAuth,
	logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
