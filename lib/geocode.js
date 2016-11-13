/*
 *  geocode.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-12
 *
 *  Caching geocode
 *
 *  Copyright [2013-2014] [David P. Janes]
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

const fs = require('fs')
const path = require('path')

const geocode = (adrd, done) => {
    const key = [
        adrd.streetAddress,
        adrd.addressLocality,
        adrd.addressRegion,
        adrd.addressCountry,
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

    const rd = {
        country: adrd.addressCountry || null,
        city: adrd.addressLocality || null,
        state: adrd.addressRegion || null,
        street: adrd.streetAddress || null,
    }

    geocoder({
        provider: 'openstreetmap',
    }).geocode(rd, (error, results) => {
        if (error) {
            return done(error);
        }

        if (_.is.Empty(results)) {
            return done(null, null);
        }

        const lld = _.d.compose.shallow({
            latitude: results[0].latitude,
            longitude: results[0].longitude,
        }, rd);

        try {
            fs.writeFileSync(cache_file, JSON.stringify(lld, null, 2))
        } catch (x) {
        }

        done(null, lld);
    })
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
