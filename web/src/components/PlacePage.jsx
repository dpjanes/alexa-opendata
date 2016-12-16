/*
 *  components/PlacePage.jsx
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

import React from 'react';

import { connect } from 'react-redux';
import C from '../constants';
import { stationSet } from '../actions/station'
import { placesListen, placesPopulate } from '../actions/places';
import { mapListen, mapSetCurrent, mapSetPreferred, mapMakePreferredCurrent } from '../actions/map';
import store from '../store'

import Header from './Header';
import PlaceMap from './PlaceMap';
import PlaceList from './PlaceList';
import PlaceTitle from './PlaceTitle';

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

		return <div />

/*
		return (
			<div className="top-spacer">
			<button className="btn btn-default" onClick={this.props.placesPopulate}>Load Sample Data</button>
			</div>
		)
		*/
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
			<PlaceTitle />
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
