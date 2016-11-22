import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import auth from './auth';
import places from './places';
import station from './station';
import map from './map';

const rootReducer = combineReducers({
	auth,
	places,
	station,
	map,
	routing: routerReducer
});

export default rootReducer;
