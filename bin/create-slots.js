/*
 *  create-slots.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-09
 *
 *  Create the Alexa Slots 
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
const config = require("../config");

const ad = minimist(process.argv.slice(2), {
    boolean: [],
    default: {
    }
});

/**
 *  "Where" is the names of places, e.g. "CN Tower"
 */
const _extract_where = self => {
    const slot_path = path.join(self.slots_folder, "Where")

    fs.writeFileSync(
        slot_path, 
        self.database
            .all()
            .filter(itemd => [ "places-of-interest", "intersections" ].indexOf(itemd._source) > -1)
            // .filter(itemd => [ itemd._source === "places-of-interest")
            .map(itemd => itemd.name)
            .sort()
            .join("\n")
            + "\n",
        "utf-8"
    )
    console.log("+", "wrote", slot_path);

    return self;
}

/**
 *  "What is the theme (part) of places, e.g. "Skating Rink"
 */
const _extract_what = self => {
    const slot_path = path.join(self.slots_folder, "What")

    fs.writeFileSync(
        slot_path, 
        self.database.theme_parts()
            .sort()
            .join("\n")
            + "\n",
        "utf-8"
    )
    console.log("+", "wrote", slot_path);

    return self;
}

Q({
    config: config,
    dst_folder: path.join(__dirname, "..", "dst"),
    slots_folder: path.join(__dirname, "..", "skill", "slots"),
    database: lib.database(),
})
    .then(lib.load_database)
    .then(_extract_where)
    .then(_extract_what)
    .then(self => {
        console.log("OK")
    })
    .catch(error => console.log("#", "error", _.error.message(error)))
