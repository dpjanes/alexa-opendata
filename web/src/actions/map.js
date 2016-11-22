import C from '../constants';
import { database } from '../firebaseApp';

let listenRef = null;

export const mapListen = () => {
	return (dispatch, getState) => {
		const station = getState().station;
		if (!station) {
            return;
		}

		if (listenRef) {
			listenRef.off()
			listenRef = null;
		}

		listenRef = database.ref(`stations/${station}/map`);
		listenRef.on('value', (snapshot) => {
            const mapd = snapshot.val() || {};

			dispatch({
				type: "MAP.SET",
                current: mapd.current || null,
                preferred: mapd.preferred || null,
			});
		}, (error) => {
		});
	};
};

export const mapSetCurrent = (latitude, longitude, zoom) => {
    return (dispatch, getState) => {
		const station = getState().station;
		if (!station) {
			return dispatch({
				type: "MAP.NO-STATION",
			})
		}

		const ref = database.ref(`stations/${station}/map/current`);
        ref.set({
            latitude: latitude,
            longitude: longitude,
            zoom: zoom,
        }, (error) => {
            if (error) {
                console.log("#", "mapSetCurrent", error)
                return;
            }

            dispatch({
                type: "MAP.SET.CURRENT",
                latitude: latitude,
                longitude: longitude,
                zoom: zoom,
            })
        });
    }
};

export const mapSetPreferred = () => {
    return (dispatch, getState) => {
		const station = getState().station;
		if (!station) {
			return dispatch({
				type: "MAP.NO-STATION",
			})
		}

        const current = getState().map.current;
		const ref = database.ref(`stations/${station}/map/preferred`);
        ref.set(getState().map.current, (error) => {
            if (error) {
                console.log("#", "mapSetPreferred", error)
                return;
            }

            dispatch({
                type: "MAP.SET.PREFERRED",
                latitude: current.latitude,
                longitude: current.longitude,
                zoom: current.zoom,
            })
        });
    }
};

export const mapMakePreferredCurrent = () => {
    return (dispatch, getState) => {
		const station = getState().station;
		if (!station) {
			return dispatch({
				type: "MAP.NO-STATION",
			})
		}

		const ref = database.ref(`stations/${station}/map`);
        ref.once('value', (snapshot) => {
            const mapd = snapshot.val();
            if (mapd && mapd.preferred) {
                ref.set({
                    preferred: mapd.preferred,
                    current: mapd.preferred,
                }, (error) => {
                    if (error) {
                        console.log("#", "mapMakePreferredCurrent", error)
                        return;
                    }
                });
            }
        }, (error) => {
            console.log("#", "mapMakePreferredCurrent", error)
        });
    }
}
