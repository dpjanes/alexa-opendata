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
