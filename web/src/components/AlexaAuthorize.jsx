import React from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import C from '../constants';
import * as firebase from 'firebase';

import { listenToAuth } from '../actions/auth';
import store from '../store'

import Auth from './Auth';
import Header from './Header';

class AlexaAuthorize extends React.Component {
	constructor() {
		super();

		this.authorize = this.authorize.bind(this);
	};

	componentWillMount() {
        store.dispatch(listenToAuth(false));
	};

	authorize() {
		const props = this.props;
		const query = this.props.location.query;

		firebase.auth().currentUser.getToken(true).then(token => {
			window.location = `/authorize-commit?token=${token}&client_id=${query.client_id}&response_type=${query.response_type}&state=${query.state}`;
		}).catch(error => {
			alert(`something went wrong: ${error.message}`)
		});
	};

	render() {
		const props = this.props;
		const query = this.props.location.query;

		return (
			<div>
			<Header />
			<div className="row">
			<h1>Alex Auth Page</h1>


			<table className="table">
			<thead>
			<tr>
			<th>What</th>
			<th>Got</th>
			<th>Expected</th>
			</tr>
			</thead>
			<tbody>

			<tr>
			<td>client_id</td>
			<td>{query.client_id}</td>
			<td>alexa-opendata</td>
			</tr>

			<tr>
			<td>token</td>
			<td>{query.response_type}</td>
			<td>token</td>
			</tr>

			<tr>
			<td>state</td>
			<td>{query.state}</td>
			<td>(some value)</td>
			</tr>

			<tr>
			<td>user id</td>
			<td>{props.auth.uid}</td>
			<td>(some value)</td>
			</tr>

			</tbody>
			</table>


			<button className="btn" onClick={() => this.authorize()}>Authorize</button>


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

export default connect(mapStateToProps, mapDispatchToProps)(AlexaAuthorize);
