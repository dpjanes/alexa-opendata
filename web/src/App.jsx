import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute } from 'react-router';

import store, { history } from './store'
import { listenToAuth } from './actions/auth';
import { placesListen } from './actions/places';
import PlacePage from './components/PlacePage';
import HomePage from './components/HomePage';

export class App extends Component {
	componentWillMount() {
		store.dispatch(listenToAuth());
		// store.dispatch(placesListen());
	}
	render() {
		return (
			<Provider store={store}>
			<Router history={history}>
			<Route path="/" component={HomePage} />
			<Route path="/stations/:station" component={PlacePage} />
			</Router>
			</Provider>
		);
	}
}
