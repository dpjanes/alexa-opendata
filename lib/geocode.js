/*
 *  geocode.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-12
 *
 *  Caching geocode
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

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const geocoder = require('node-geocoder');
const async = require('async');
const Q = require('q');

const fs = require('fs')
const path = require('path')

const geocode = (adrd, done) => {
    const key = [
        adrd.streetAddress,
        adrd.addressLocality,
        adrd.addressRegion,
        adrd.addressCountry,
        adrd.postalCode,
    ].filter(v => v).map(_.id.slugify).join("-");

    const cache_folder = path.join(process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME, ".alexa-opendata");
    try {
        fs.mkdirSync(cache_folder);
    } catch (x) {
    }

    const cache_file = path.join(cache_folder, key);

    try {
        return done(null, JSON.parse(fs.readFileSync(cache_file, 'utf-8')))
    } catch (x) {
        if (x.code !== 'ENOENT') {
            throw x;
        }
    }

    console.log("-", "geocode", key);

    geocoder({
        provider: 'google',
        apiKey: require("../config.json").googleApiKey,
    }).geocode(key, (error, results) => {
        console.log(error, results)
        if (error) {
            return done(error);
        }
        
        const lld = {
            streetAddress: adrd.streetAddress || null,
            addressLocality: adrd.addressLocality || null,
            addressRegion: adrd.addressRegion || null,
            addressCountry: adrd.addressCountry || null,
            postalCode: adrd.postalCode || null,
        }
        if (!_.is.Empty(results)) {
            lld.latitude = results[0].latitude;
            lld.longitude = results[0].longitude;
        }

        try {
            fs.writeFileSync(cache_file, JSON.stringify(lld, null, 2))
        } catch (x) {
        }

        done(null, lld);
    })
}

// --
const geocode_all = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    const fs = self.itemds.map(d => inner_done => {
        if (_.is.Number(d.latitude) && _.is.Number(d.longitude)) {
            return inner_done(null);
        }

        geocode(d, (error, lld) => {
            if (error) {
                return inner_done(error);
            }

            // rewrite 
            if (lld && _.is.Number(lld.latitude) && _.is.Number(lld.longitude)) {
                d.latitude = lld.latitude;
                d.longitude = lld.longitude;
            }

            inner_done(null);
        });
    })
    fs.push(() => done(null, self));

    async.series(fs);
}
/*
geocode({
    "addressCountry": "CA",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "name": "Raymore Park",
    "postalCode": "M9P 1W9",
    "streetAddress": "93 Raymore Dr",
}, (error, lld) => {
    console.log(lld);
})
*/

/**
 *  API
 */
exports.geocode = geocode;
exports.geocode_all = Q.denodeify(geocode_all);
