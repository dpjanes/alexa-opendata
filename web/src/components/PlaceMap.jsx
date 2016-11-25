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
        const bounds = new google.maps.LatLngBounds();
        this.props.places.ds.forEach(place => {
            const ll = new google.maps.LatLng(place.latitude, place.longitude);
            bounds.extend(ll);
        })

        gmap.fitBounds(bounds);

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
