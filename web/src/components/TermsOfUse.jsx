/*
 *  components/TermsOfUse.jsx
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

class TermsOfUse extends React.Component {
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
			<h1>Terms of Use</h1>

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

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
