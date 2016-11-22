/*
 *  compile.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-12
 *
 *  Build Park Data
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

const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const unirest = require('unirest')
const yaml = require('js-yaml');
const Q = require('q');

const common = require("../../lib");

const _fix_name = (self, name) => {
    if (!name) {
        return null;
    }

    name = common.capwords(name);

    _.mapObject(_.d.first(self, "fix_name") || {}, (value, key) => {
        const key_re = new RegExp(key)
        name = name.replace(key_re, () => value);
    })

    return name;
}

// --
const _build = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.outds = _.flatten(
        _.d.list(self.data, "/Locations/Location", [])
        .map(ld => {
            const ad = _.d.compose.shallow({
                name: _fix_name(self, _.d.first(ld, "LocationName", null)),
                postalCode: _.d.first(ld, "PostalCode", null),
                streetAddress: _.d.first(ld, "Address", null),
            }, self.address)

            return _.d.list(ld, "Facilities/Facility", [])
                .map(fd => _.d.add(fd, "_subcategory", _.d.list(self.subcategory, fd.FacilityDisplayName, [])))
                .map(fd => _.d.compose.shallow(ad, {
                    "_id": `urn:x-opendata:ca:on:toronto:parks:${ _.id.slugify(ld.LocationID) }:facility:${ _.id.slugify(fd.FacilityID) }`,
                    "_theme": fd._subcategory
                        .filter(s => !_.is.Empty(s))
                        .map(s => `Park … ${ s }`),
                }))
        }), false)

    return done(null, self);
}
const _q_build = Q.denodeify(_build);
    
// -- put it altogether
const compile = (done) => {
    Q({
        folder: __dirname,
    })
        .then(common.q_load_configuration)
        .then(common.q_load_data_from_file)
        .then(common.q_load_data_from_url)
        .then(common.q_parse_xml)
        .then(common.q_flatten_xml)
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
