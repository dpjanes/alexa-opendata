/*

import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
	const logger = createLogger();
	middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const store = createStoreWithMiddleware(rootReducer);
export default store;


*/

import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const defaultState = {
}

const enhancers = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
)

const middlewares = [
  // createLogger(),
  routerMiddleware(browserHistory),
  thunk
]

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const store = createStoreWithMiddleware(rootReducer, defaultState, enhancers);
export const history = syncHistoryWithStore(browserHistory, store)
export default store;
