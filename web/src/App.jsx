/*
 *  App.jsx
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
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute } from 'react-router';

import store, { history } from './store'
import { listenToAuth } from './actions/auth';
import { placesListen } from './actions/places';
import PlacePage from './components/PlacePage';
import HomePage from './components/HomePage';
import AlexaAuthorize from './components/AlexaAuthorize';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';

export class App extends Component {
	componentWillMount() {
		// store.dispatch(listenToAuth());
		// store.dispatch(placesListen());
	}
	render() {
		return (
			<Provider store={store}>
			<Router history={history}>
			<Route path="/" component={HomePage} />
			<Route path="/authorize" component={AlexaAuthorize} />
			<Route path="/privacy-policy" component={PrivacyPolicy} />
			<Route path="/terms-of-use" component={TermsOfUse} />
			<Route path="/stations/:station" component={PlacePage} />
			</Router>
			</Provider>
		);
	}
}
