export default (state = {
    timestamp: new Date().toISOString(),
    ds: []
}, action) => {
    switch (action.type) {
        case 'PLACES.POPULATE':
            return state;

        case 'PLACES.POPULATED':
            return state;

        case 'PLACES.SET':
            return {
                timestamp: new Date().toISOString(),
                ds: action.placeds,
            }

		default:
            return state;
	}
}
