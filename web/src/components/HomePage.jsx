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

import { connect } from 'react-redux';
import C from '../constants';

import { listenToAuth } from '../actions/auth';
import store from '../store'

import Auth from './Auth';
import Header from './Header';

class HomePage extends React.Component {
	constructor() {
		super();
	};

	componentWillMount() {
		store.dispatch(listenToAuth(true));
		/*
		console.log("componentWillMount", this.props.auth)
		if (this.props.auth.status === C.AUTH_LOGGED_IN) {
			this.props.history.push(`/stations/${this.props.auth.uid}`)
		}
		*/
    }

	render() {
		return (
   		 <div>
		 <Header />
		 <div className="alert alert-danger" role="alert">
		 <p>Please sign in to get started</p>
		 </div>
		 </div>
    	);
	}
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	};
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
