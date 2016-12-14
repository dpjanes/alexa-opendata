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
