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

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { openAuth, logoutUser } from '../actions/auth';
import C from '../constants';

class Header extends React.Component {
	constructor() {
		super();

		this.loginState = this.loginState.bind(this);
		this.sign_in = this.sign_in.bind(this);
		this.sign_out = this.sign_out.bind(this);
	};

	sign_in(event) {
		event.preventDefault();
		this.props.openAuth();
	}

	sign_out(event) {
		event.preventDefault();
		this.props.logoutUser();
	}

    loginState() {
        const props = this.props;
        switch (props.auth.status) {
            case C.AUTH_LOGGED_IN: return (
                <div className="navbar-text">
				{props.auth.username}
				&nbsp;&middot;&nbsp;
				<a className="navbar-link" href="#" onClick={this.sign_out}>Sign out</a>
                </div>
                    );
            case C.AUTH_AWAITING_RESPONSE: return (
                <a href="#" disabled>Authenticating...</a>
                );
            default: return (
                <a href="#" onClick={this.sign_in}>Sign in</a>
                );
        }
    }

	render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div className="container">
			<div className="navbar-header">
			<button type="button"
			className="navbar-toggle collapsed"
			data-toggle="collapse"
			data-target="#navbar"
			aria-expanded="false"
			aria-controls="navbar"
             >
			<span className="sr-only">Toggle navigation</span>
			<span className="icon-bar"></span>
			<span className="icon-bar"></span>
			<span className="icon-bar"></span>
			</button>
			<Link to="/" className="navbar-brand" href="/">Hey, Toronto</Link>
			</div>
			<div id="navbar" className="collapse navbar-collapse">
			<ul className="nav navbar-nav navbar-right">
			<li>{ this.loginState()}</li>
			</ul>
			</div>
			</div>
    		</nav>
        )
    }
};

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
	openAuth,
	logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
