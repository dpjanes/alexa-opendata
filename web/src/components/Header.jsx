import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { openAuth, logoutUser } from '../actions/auth';
import C from '../constants';

class Header extends React.Component {
	constructor() {
		super();

		this.loginState = this.loginState.bind(this);
		this.sign_in = this.sign_in.bind(this);
		this.sign_out = this.sign_out.bind(this);
	};

	sign_in(event) {
		event.preventDefault();
		this.props.openAuth();
	}

	sign_out(event) {
		event.preventDefault();
		this.props.logoutUser();
	}

    loginState() {
        const props = this.props;
        switch (props.auth.status) {
            case C.AUTH_LOGGED_IN: return (
                <div className="navbar-text">
				{props.auth.username}
				&nbsp;&middot;&nbsp;
				<a className="navbar-link" href="#" onClick={this.sign_out}>Sign out</a>
                </div>
                    );
            case C.AUTH_AWAITING_RESPONSE: return (
                <a href="#" disabled>Authenticating...</a>
                );
            default: return (
                <a href="#" onClick={this.sign_in}>Sign in</a>
                );
        }
    }

	render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div className="container">
			<div className="navbar-header">
			<button type="button"
			className="navbar-toggle collapsed"
			data-toggle="collapse"
			data-target="#navbar"
			aria-expanded="false"
			aria-controls="navbar"
             >
			<span className="sr-only">Toggle navigation</span>
			<span className="icon-bar"></span>
			<span className="icon-bar"></span>
			<span className="icon-bar"></span>
			</button>
			<Link to="/" className="navbar-brand" href="/">Hey, Toronto</Link>
			</div>
			<div id="navbar" className="collapse navbar-collapse">
			<ul className="nav navbar-nav navbar-right">
			<li>{ this.loginState()}</li>
			</ul>
			</div>
			</div>
    		</nav>
        )
    }
};

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
	openAuth,
	logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
