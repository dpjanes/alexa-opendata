import * as firebase from 'firebase';
import { push } from 'react-router-redux';
import C from '../constants';
import { auth } from '../firebaseApp';

import { placesListen } from './places';

export const listenToAuth = () => {
	return (dispatch, getState) => {
		auth.onAuthStateChanged((authData) => {
			if (authData) {
				dispatch(push(`/stations/${authData.uid}`));
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
