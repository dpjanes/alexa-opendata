/*
 *  compile.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-12
 *
 *  Build Places of Worship Data
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

const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const unirest = require('unirest')
const yaml = require('js-yaml');
const Q = require('q');

const common = require("../../lib");

// --
const _build = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.outds = _.d.list(self.data, "/features", [])
        .map(featured => {
            const outd = _.d.compose.shallow({
                "_type": [ "what", "where", ],
                "name": _.d.first(featured, "properties/ORGANIZATI", null),
                "streetAddress": _.d.first(featured, "properties/ADDRESS", null),
                "addressLocality": _.d.first(featured, "properties/CITY", null),
                "latitude": _.d.first(featured, "properties/LATITUDE", null),
                "longitude": _.d.first(featured, "properties/LONGITUDE", null),
            }, self.address)

            outd._id = `urn:ca:on:toronto:places-of-worship:${_.id.slugify(outd.streetAddress)}:${_.id.slugify(outd.name)}`;

            const faith = _.d.first(featured, "properties/FAITH", null);
            const subcategories = self.subcategory[faith];
            if (!_.is.Empty(subcategories)) {
                outd._category = subcategories.map(s => `Places of Worship/${ s }`)
            }

            return outd;
        })

    return done(null, self);
}
const _q_build = Q.denodeify(_build);
    
// -- put it altogether
const compile = (done) => {
    Q({
        data_file: 'data.json',
        folder: __dirname,
    })
        .then(common.q_load_configuration)
        .then(common.q_load_data_from_file)
        .then(common.q_load_data_from_url)
        .then(common.q_parse_json)
        .then(_q_build)
        .then(common.q_geocode_all)
        .then(self => done(null, self.outds))
        .catch(error => done(error));
}

/**
 *  API / Main
 */
if (require.main === module) {
    common.main(compile);
}

exports.compile = compile;
