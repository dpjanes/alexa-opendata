import React from 'react';

import { connect } from 'react-redux';
import C from '../constants';

import Auth from './Auth';
import Header from './Header';

class HomePage extends React.Component {
	constructor() {
		super();
	};

	componentWillMount() {
		console.log("componentWillMount", this.props.auth)
		if (this.props.auth.status === C.AUTH_LOGGED_IN) {
			this.props.history.push(`/stations/${this.props.auth.uid}`)
		}
    }

	render() {
		return (
   		 <div>
		 <Header />
		 <div className="alert alert-danger" role="alert">
		 <p>Please sign in to get started</p>
		 </div>
		 </div>
    	);
	}
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	};
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
