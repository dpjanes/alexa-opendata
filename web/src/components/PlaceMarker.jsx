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
