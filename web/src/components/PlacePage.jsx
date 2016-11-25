import React from 'react';

import { connect } from 'react-redux';
import C from '../constants';
import { stationSet } from '../actions/station'
import { placesListen, placesPopulate } from '../actions/places';
import { mapListen, mapSetCurrent, mapSetPreferred, mapMakePreferredCurrent } from '../actions/map';
import store from '../store'

import Auth from './Auth';
import Header from './Header';
import PlaceMap from './PlaceMap';
import PlaceList from './PlaceList';

class PlacePage extends React.Component {
	constructor() {
		super();

		this.renderPopulate = this.renderPopulate.bind(this);
		this.renderSaveMap = this.renderSaveMap.bind(this);
		this.onBoundsChange = this.onBoundsChange.bind(this);
	};

	componentWillMount() {
		this.props.stationSet(this.props.params.station);
		store.dispatch(placesListen());
		store.dispatch(mapListen());

		this.props.mapMakePreferredCurrent();
	}

	onBoundsChange(center, zoom) {
		this.center = center;
		this.zoom = zoom;

		if (this.boundsChangeInterval) {
			clearTimeout(this.boundsChangeInterval);
		}

		this.boundsChangeInterval = setTimeout(() => {
			this.props.mapSetCurrent(this.center.lat, this.center.lng, this.zoom)
		}, 1000);
	}

    renderPopulate() {
		if (this.props.places.ds.length) {
			return <div />
		}
        if (this.props.auth.status !== C.AUTH_LOGGED_IN) {
			return <div />
		}
		if (this.props.auth.uid !== this.props.params.station) {
			return <div />
		}

		return (
			<div className="top-spacer">
			<button className="btn btn-default" onClick={this.props.placesPopulate}>Load Sample Data</button>
			</div>
		)
    }

	renderSaveMap() {
		if (this.props.auth.status !== C.AUTH_LOGGED_IN) {
			return <div />
		}
		if (this.props.auth.uid !== this.props.params.station) {
			return <div />
		}

		return (
			<div className="top-spacer">
			<button className="btn btn-default" onClick={this.props.mapSetPreferred}>Save Map Position as Default</button>
			</div>
		)
	}

	render() {
		const current = this.props.map.current;

		return (
			<div>
			<Header />
			<div className="row">
			<div className="col-md-8 the-map">
			<PlaceMap onBoundsChange={this.onBoundsChange}
			latitude={current.latitude}
			longitude={current.longitude}
			zoom={current.zoom}	/>
			{this.renderSaveMap()}
			</div>
			<div className="col-md-4 the-list">
			<PlaceList />
			{this.renderPopulate()}
			</div>
			</div>
			</div>
    	);
	}
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		station: state.station,
		places: state.places,
		map: state.map,
	};
};

const mapDispatchToProps = {
	stationSet,
	placesPopulate,
	mapSetCurrent,
	mapSetPreferred,
	mapMakePreferredCurrent,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacePage);
