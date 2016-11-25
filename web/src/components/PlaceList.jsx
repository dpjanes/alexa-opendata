import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import PlaceMarker from './PlaceMarker';

class PlaceList extends Component {
    constructor(props) {
        super(props);

        this.renderPlace = this.renderPlace.bind(this);
    }

    renderPlace(placed, index) {
        return (
            <tr key={index} className="place">
            <td className="place-index">
            <PlaceMarker
            type="list" lat={placed.latitude} lng={placed.longitude} text={`${index + 1}`} />
            </td>
            <td className="place-detail">
            <strong>{placed.name}</strong>
            {placed.streetAddress}
            </td>
            </tr>
        )
    }

    render() {
        const style=`
        .place-index {
            padding-right: 1em;
            padding-bottom: .5em;
            padding-top: .5em;
        }
        .place-detail strong {
            display: block;
        }
        `;

        return (
            <div>
            <style>{style}</style>
            <table className="places list-unstyled">
            <tbody>{ this.props.places.ds.map(this.renderPlace) }</tbody>
            </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        places: state.places,
    };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceList);
