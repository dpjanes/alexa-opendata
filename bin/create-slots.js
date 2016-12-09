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

const ad = minimist(process.argv.slice(2), {
    boolean: [],
    default: {
    }
});

const _extract_locations = self => {
    const slot_path = path.join(self.slots_folder, "Locations")

    fs.writeFileSync(
        slot_path, 
        self.database.names()
            .sort()
            .join("\n")
            + "\n",
        "utf-8"
    )
    console.log("+", "wrote", slot_path);

    return self;
}

const _extract_theme_parts = self => {
    const slot_path = path.join(self.slots_folder, "Whats")

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
    dst_folder: path.join(__dirname, "..", "dst"),
    slots_folder: path.join(__dirname, "..", "alexa", "slots"),
    database: lib.database(),
})
    .then(lib.load_database)
    .then(_extract_locations)
    .then(_extract_theme_parts)
    .then(self => {
        console.log("OK")
    })
    .catch(error => console.log("#", "error", _.error.message(error)))
