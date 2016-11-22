const initd = {
    current: {
        latitude: 43.6532,
        longitude: -79.3832,
        zoom: 9,
    },
    preferred: {
        latitude: 43.6532,
        longitude: -79.3832,
        zoom: 9,
    }
}

export default (state = initd, action) => {
    switch (action.type) {
        case 'MAP.SET':
            return {
                current: action.current || initd.current,
                preferred: action.preferred || initd.preferred,
            }

        case 'MAP.SET.CURRENT':
            return {
                current: {
                    latitude: action.latitude,
                    longitude: action.longitude,
                    zoom: action.zoom,
                },
                preferred: state.preferred,
            }

        case 'MAP.SET.PREFERRED':
            return {
                preferred: {
                    latitude: action.latitude,
                    longitude: action.longitude,
                    zoom: action.zoom,
                },
                current: state.current,
            }

		default:
            return state;
	}
}
