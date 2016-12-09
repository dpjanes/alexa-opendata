export default (state = {
    timestamp: new Date().toISOString(),
    ds: [],
    title: "<b>X</b> near the <b>Y</b>"
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
                title: action.title || state.title,
            }

        case 'PLACES.TITLE':
            return Object.assign({}, state, {
                title: action.title || ""
            });

		default:
            return state;
	}
}
