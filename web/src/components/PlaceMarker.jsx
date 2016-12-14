/*
 *  xxx.js
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

const K_WIDTH = 40;
const K_HEIGHT = 40;

const defaultStyle = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  userSelect: 'none',

  className: "marker"
};

export default class PlaceMarker extends Component {
    render() {
        const styled = Object.assign({}, defaultStyle);
        if (this.props.type === "list") {
            styled.position = "inline";
            styled.left = 0;
            styled.top = 0;
        }
        return (
           <div style={styled}>{this.props.text}</div>
        );
    }
}
