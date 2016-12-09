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

const lib = require("../lib")

const ad = minimist(process.argv.slice(2), {
    boolean: [ "firebase" ],
    default: {
        n: 5,
        latitude: 43.736342,
        longitude: -79.419222,
        name: null,
        theme: null,
    }
});

const start = Q({
    dst_folder: path.join(__dirname, "..", "dst"),
    database: lib.database(),

    station: "xhP0Y6lsKOW0OZXHBMEPnFvmKZw2",

    n: ad.n,
    latitude: ad.latitude,
    longitude: ad.longitude,

    name: ad.name,
    theme_part: ad.theme,
})
    .then(lib.load_database)
    .then(ad.firebase ? lib.firebase.connect : null);

const _done = (self) => {
    console.log("+", "done", self.itemds.length);

    if (ad.firebase) {
        setInterval(() => process.exit(), 500);
    } else {
        console.log(JSON.stringify(self.itemds, null, 2));
    }
}
const _error = (error) => {
    console.log("#", _.error.message(error));

    if (ad.firebase) {
        setInterval(() => process.exit(), 500);
    }
}

if (ad.name && ad.theme) {
    start
        .then(self => _.d.add(self, "title", `<b>${self.theme_part}</b> near <b>${self.name}</b>`))
        .then(lib.query_name)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.make_result_center)
        .then(lib.query_theme_part)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.uniq)
        .then(lib.limit)
        .then(ad.firebase ? lib.firebase.update_places : null)
        .then(ad.firebase ? lib.firebase.update_title : null)
        .then(_done)
        .catch(_error);
} else if (ad.name) {
    start
        .then(self => _.d.add(self, "title", `<b>${self.name}</b>`))
        .then(lib.query_name)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.uniq)
        .then(lib.limit)
        .then(ad.firebase ? lib.firebase.update_places : null)
        .then(ad.lib.firebase ? firebase.update_title : null)
        .then(_done)
        .catch(_error);
} else if (ad.theme) {
    start
        .then(self => _.d.add(self, "title", `<b>${self.theme_part}</b> near me`))
        .then(lib.query_theme_part)
        .then(lib.filter_ll)
        .then(lib.sort_by_distance)
        .then(lib.uniq)
        .then(lib.limit)
        .then(ad.firebase ? lib.firebase.update_places : null)
        .then(ad.firebase ? lib.firebase.update_title : null)
        .then(_done)
        .catch(_error);
} else {
    console.log("#", "one or both of --name and --theme required");
}

