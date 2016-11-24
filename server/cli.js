/*
 *  cli.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-24
 *
 *  Command Line Interface (mainly for testing)
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

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const Q = require('q');
const minimist = require('minimist');

const database = require("./database");
const load = require("./load")
const util = require("./util")
const query = require("./query")

const ad = minimist(process.argv.slice(2), {
    boolean: [],
    default: {
        n: 3,
        latitude: 43.736342,
        longitude: -79.419222,
        name: null,
        theme: null,
    }
});

const start = Q({
    dst_folder: path.join(__dirname, "..", "dst"),
    database: database.database(),
    n: ad.n,
    latitude: ad.latitude,
    longitude: ad.longitude,

    name: ad.name,
    theme_part: ad.theme,
})
    .then(load.load);

if (ad.name && ad.theme) {
    start
        .then(query.query_name)
        .then(util.filter_ll)
        .then(util.sort_by_distance)
        .then(util.make_result_center)
        .then(query.query_theme_part)
        .then(util.filter_ll)
        .then(util.sort_by_distance)
        .then(util.uniq)
        .then(util.limit)
        .then(self => {
            console.log(JSON.stringify(self.resultds, null, 2));
        })
        .catch(error => {
            console.log("#", _.error.message(error));
        })
} else if (ad.name) {
    start
        .then(query.query_name)
        .then(util.filter_ll)
        .then(util.sort_by_distance)
        .then(util.uniq)
        .then(util.limit)
        .then(self => {
            console.log(JSON.stringify(self.resultds, null, 2));
        })
        .catch(error => {
            console.log("#", _.error.message(error));
        })
} else if (ad.theme) {
    start
        .then(query.query_theme_part)
        .then(util.filter_ll)
        .then(util.sort_by_distance)
        .then(util.uniq)
        .then(util.limit)
        .then(self => {
            console.log(JSON.stringify(self.resultds, null, 2));
        })
        .catch(error => {
            console.log("#", _.error.message(error));
        })
} else {
    console.log("#", "one or both of --name and --theme required");
}

