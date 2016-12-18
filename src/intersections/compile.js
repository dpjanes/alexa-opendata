/*
 *  compile.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-17
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

// lazy hacker…
const _combinations = parts => {
    switch (parts.length) {
    case 0:
        return [ ]
    case 1:
        return [ [ parts[0] ] ]
    case 2:
        return [
            [ parts[0], parts[1] ],
            [ parts[1], parts[0] ],
        ]
    default:
        return [
            [ parts[0], parts[1] ],
            [ parts[0], parts[2] ],
            [ parts[1], parts[2] ],

            [ parts[1], parts[0] ],
            [ parts[2], parts[0] ],
            [ parts[2], parts[1] ],
        ]
    }
}

const _fix_name = (self, name) => {
    if (!name) {
        return null;
    }

    let parts = name.split("/")
        .map(part => part.replace(/ (Trl|Ave|Blvd|Dr|Rd|St|S|N|W|E)\b.*$/, ''))
        .map(part => part.replace(/^ +/, ''))
        .map(part => part.replace(/ +$/, ''))
        .filter(part => part.length)
        .sort()

    parts = _.uniq(parts)
    
    return _combinations(parts)
        .map(subparts => subparts.join(" and "))

    return parts
}

// --
const _build = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    self.itemds = _.d.list(self.data, "/features", [])
        .filter(featured => _.d.first(featured, "properties/INTERSEC5"))
        .filter(featured => _.d.first(featured, "properties/INTERSEC5").indexOf("/") > -1)
        .filter(featured => _.d.first(featured, "properties/INTERSEC5").toLowerCase().indexOf("ramp") === -1)
        .filter(featured => self.filter[_.d.first(featured, "properties/CLASSIFI7")])
        .map(featured => {
            const itemd = _.d.compose.shallow({
                "_source": self.source,
                "_name": _.d.first(featured, "properties/INTERSEC5"),
                "name": _fix_name(self, _.d.first(featured, "properties/INTERSEC5", null)),
                "latitude": _.d.first(featured, "properties/LATITUDE", null),
                "longitude": _.d.first(featured, "properties/LONGITUDE", null),
            }, self.address)

            // itemd._id = `urn:x-opendata:ca:on:toronto:intersections:${_.id.slugify(itemd._name)}`;
            itemd._id = [
                "urn",
                "x-opendata",
                _.id.slugify(self.address.addressCountry),
                _.id.slugify(self.address.addressRegion),
                _.id.slugify(self.address.addressLocality),
                self.source,
                _.id.slugify(itemd._name),
            ].join(":")
            itemd._theme = "Intersection"

            return itemd;
        })

    return done(null, self);
}
const _q_build = Q.denodeify(_build);
    
// -- put it altogether
const compile = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    self.folder = __dirname;

    Q(self)
        .then(common.load_configuration)
        .then(common.load_data_from_file)
        // .then(common.load_data_from_url)
        .then(common.parse_json)
        .then(_q_build)
        .then(common.geocode_all)
        .then(self => done(null, self))
        .catch(error => done(error));
}

/**
 *  API / Main
 */
if (require.main === module) {
    common.main(compile);
}

exports.compile = compile;
