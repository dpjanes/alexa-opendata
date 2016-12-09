import C from '../constants';
import { database } from '../firebaseApp';


const initialState = [
  {
    "_id": "urn:x-opendata:ca:on:toronto:parks:1:facility:42376",
    "_theme": [
      "Park \u2026 Skateboard Park"
    ],
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "latitude": 43.66290619999999,
    "longitude": -79.311786,
    "name": "Ashbridge's Bay Park",
    "postalCode": "M4L 3W6",
    "streetAddress": "Lake Shore Blvd Est"
  },
  {
    "_id": "urn:x-opendata:ca:on:toronto:parks:6:facility:6149p1_playground_0",
    "_theme": [
      "Park \u2026 Playground"
    ],
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "latitude": 43.5879974,
    "longitude": -79.54285809999999,
    "name": "Marie Curtis Park",
    "postalCode": "M8W 3P2",
    "streetAddress": "2 Forty Second St"
  },
  {
    "_id": "urn:x-opendata:ca:on:toronto:parks:9:facility:17948",
    "_theme": [
      "Park \u2026 Playground"
    ],
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "latitude": 43.6859006,
    "longitude": -79.4938888,
    "name": "Eglinton Flats Sports Facility",
    "postalCode": "M6M 1V7",
    "streetAddress": "3601 Eglinton Ave W"
  },
  {
    "_id": "urn:x-opendata:ca:on:toronto:parks:9:facility:366",
    "_theme": [
      "Park \u2026 Sport Field"
    ],
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "latitude": 43.6859006,
    "longitude": -79.4938888,
    "name": "Eglinton Flats Sports Facility",
    "postalCode": "M6M 1V7",
    "streetAddress": "3601 Eglinton Ave W"
  },
  {
    "_id": "urn:x-opendata:ca:on:toronto:parks:13:facility:1128",
    "_theme": [
      "Park \u2026 Playground"
    ],
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "latitude": 43.6828607,
    "longitude": -79.2888497,
    "name": "Adam Beck Cc",
    "postalCode": "M4E 3L8",
    "streetAddress": "79 Lawlor Ave"
  },
  {
    "_id": "urn:x-opendata:ca:on:toronto:parks:1865:facility:43258",
    "_theme": [
      "Park \u2026 Sport Field"
    ],
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "latitude": 43.7146723,
    "longitude": -79.2806243,
    "name": "Warden Hilltop Community Centre",
    "postalCode": "M1L 0G6",
    "streetAddress": "25 Mendelssohn St"
  }
]

let listenPlacesRef = null;
let listenTitleRef = null;

export const placesListen = () => {
	return (dispatch, getState) => {
		const station = getState().station;
		if (!station) {
			return dispatch({
				type: "PLACES.SET",
				placeds: []
			})
		}

        if (listenPlacesRef) {
			listenPlacesRef.off()
		}

		listenPlacesRef = database.ref(`stations/${station}/places`);
		listenPlacesRef.on('value', (snapshot) => {
            const placeds = (snapshot.val() || []).filter(value => value);
            dispatch({
				type: "PLACES.SET",
				placeds: placeds,
			});
		}, (error) => {
		});

        if (listenTitleRef) {
			listenTitleRef.off()
		}
        listenTitleRef = database.ref(`stations/${station}/query/title`);
		listenTitleRef.on('value', (snapshot) => {
            const title = snapshot.val() || null;
            dispatch({
				type: "PLACES.TITLE",
				title: title || null,
			});
		}, (error) => {
		});
	};
};

export const placesPopulate = () => {
    return (dispatch, getState) => {
		const station = getState().station;
		if (!station) {
			return dispatch({
				type: "PLACES.NO-STATION",
			})
		}

		const placesRef = database.ref(`stations/${station}/places`);

        placesRef.set(initialState || [], (error) => {
            if (error) {
                console.log("#", "placesPopulate", error)
                return;
            }

            dispatch({
                type: "PLACES.POPULATED"
            })
        });
    }
};
