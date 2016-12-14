import React from 'react';

import { connect } from 'react-redux';
import C from '../constants';

import { listenToAuth } from '../actions/auth';
import store from '../store'

import Auth from './Auth';
import Header from './Header';

class AlexaAuthorize extends React.Component {
	constructor() {
		super();
	};

	componentWillMount() {
        store.dispatch(listenToAuth(false));
	}

	render() {
		const props = this.props;

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
			<td>{props.params.client_id}</td>
			<td>alexa-opendata</td>
			</tr>

			<tr>
			<td>token</td>
			<td>{props.params.client_id}</td>
			<td>token</td>
			</tr>

			<tr>
			<td>user id</td>
			<td>{props.auth.uid}</td>
			<td>(some value)</td>
			</tr>

			</tbody>
			</table>


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
