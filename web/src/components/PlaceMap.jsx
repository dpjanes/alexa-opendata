/*
 *  components/PlaceMap.jsx
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

import React, {PropTypes, Component} from 'react';
import GoogleMap from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import PlaceMarker from './PlaceMarker';
import { connect } from 'react-redux';

class PlaceMap extends Component {
    constructor(props) {
        super(props);

        this.reboundMap = this.reboundMap.bind(this);
    }

    componentDidUpdate() {
        if (this.refs.map && google && this.props.places.ds && this.props.places.ds.length) {
            this.reboundMap();
        }
    }

    reboundMap() {
        if (this.timestamp === this.props.places.timestamp) {
            return;
        }

        const gmap = this.refs.map.map_;
        if (!gmap) {
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        this.props.places.ds.forEach(place => {
            const ll = new google.maps.LatLng(place.latitude, place.longitude);
            bounds.extend(ll);
        })

        if (!bounds.isEmpty()) {
            const originalMaxZoom = gmap.maxZoom;
            gmap.setOptions({maxZoom: 18});
            gmap.fitBounds(bounds);

            /*
            setTimeout(() => {
                gmap.setOptions({maxZoom: originalMaxZoom});
            }, 1000);
            */
        }

        this.timestamp = this.props.places.timestamp;
    }

    render() {
      return (
        <div id="map">
        <GoogleMap
        ref="map"
        onBoundsChange={this.props.onBoundsChange}
        bootstrapURLKeys={{
        key: "AIzaSyA1arApy0kMaZveKVJiXYpLC02j4lDNcyI",
        }}
        center={{lat: this.props.latitude, lng: this.props.longitude}}
        zoom={this.props.zoom}>
        {
        this.props.places.ds.map((placed, index) => {
            return <PlaceMarker key={index}
            lat={placed.latitude} lng={placed.longitude} text={`${index + 1}`} />
        })
        }
        </GoogleMap>
        </div>
        );
    }
}

const mapStateToProps = (state) => {
	return {
        places: state.places,
        map: state.map,
	};
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceMap);
