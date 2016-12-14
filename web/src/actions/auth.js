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

import * as firebase from 'firebase';
import { push } from 'react-router-redux';
import C from '../constants';
import { auth } from '../firebaseApp';

import { placesListen } from './places';

export const listenToAuth = (push_when_authorized) => {
	return (dispatch, getState) => {
		auth.onAuthStateChanged((authData) => {
			if (authData) {
				if (push_when_authorized) {
					console.log("AUTH PUSH")
					dispatch(push(`/stations/${authData.uid}`));
				}

				dispatch({
					type: C.AUTH_LOGIN,
					uid: authData.uid,
					username: authData.displayName
				});

				const placesListenDispatcher = placesListen();
				placesListenDispatcher(dispatch, getState);
			} else {
				if (getState().auth.status !== C.AUTH_ANONYMOUS) {
					dispatch({ type: C.AUTH_LOGOUT });
				}
			}
		});
	};
};

export const openAuth = () => {
	return (dispatch) => {
		dispatch({ type: C.AUTH_OPEN });
		// const provider = new firebase.auth.FacebookAuthProvider();
		const provider = new firebase.auth.GithubAuthProvider();
		auth.signInWithPopup(provider)
			.catch((error) => {
				dispatch({
					type: C.FEEDBACK_DISPLAY_ERROR,
					error: `Login failed! ${error}`
				});
				dispatch({ type: C.AUTH_LOGOUT });
			});
	};
};

export const logoutUser = () => {
	return (dispatch) => {
		dispatch({ type: C.AUTH_LOGOUT });
		auth.signOut();
	};
};
