export default (state = [], action) => {
    switch (action.type) {
        case 'PLACES.POPULATE':
            return state;

        case 'PLACES.POPULATED':
            return state;

        case 'PLACES.SET':
            return [...action.placeds];

		default:
            return state;
	}
}
