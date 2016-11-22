import React, {PropTypes, Component} from 'react';
import GoogleMap from 'google-map-react';
import PlaceMarker from './PlaceMarker';
import { connect } from 'react-redux';

class PlaceMap extends Component {
  constructor(props) {
      super(props);
  }

  render() {
      return (
        <div id="map">
        <GoogleMap
        onBoundsChange={this.props.onBoundsChange}
        bootstrapURLKeys={{
        key: "AIzaSyA1arApy0kMaZveKVJiXYpLC02j4lDNcyI",
        }}
        center={{lat: this.props.latitude, lng: this.props.longitude}}
        zoom={this.props.zoom}>
        {
        this.props.places.map((placed, index) => {
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
