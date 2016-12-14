/*
 *  components/PlaceList.jsx
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
