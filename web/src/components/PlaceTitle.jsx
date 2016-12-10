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
