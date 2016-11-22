export default (state = null, action) => {
    switch (action.type) {
        case 'STATION.SET':
            return action.station;

		default:
            return state;
	}
}
