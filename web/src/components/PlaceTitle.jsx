/*
 *  components/PlaceTitle.jsx
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

class PlaceTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style=`
        `;

        return (
            <h1 dangerouslySetInnerHTML={{__html: this.props.places.title}}></h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaceTitle);
