/*
 *  load.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-24
 *
 *  The database of locations
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

const yaml = require('js-yaml');
const Q = require('q');

const _load = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.dst_folder, "load: self.dst_folder required");
    assert.ok(self.database, "load: self.database required");

    fs.readdir(self.dst_folder, (error, files) => {
        if (error) {
            return done(error, self);
        }

        self.folders = files
            .filter(file => file.endsWith(".yaml"))
            .map(file => path.join(self.dst_folder, file))
            .filter(yaml_path => _.fs.is.file)
            .forEach(yaml_path => {
                const document = fs.readFileSync(yaml_path, "utf-8")
                yaml.load(document)
                    .forEach(itemd => self.database.add(itemd));
            })

        done(null, self);
    });
}

/**
 *  API
 */
exports.load = Q.denodeify(_load);

/*
const database = require("./database").database();
_load({
    dst_folder: path.join(__dirname, "..", "dst"),
    database: database,
}, (error, self) => {
    console.log("+", self.database.count());
    console.log(self.database.list_by_name("CN Tower"));
    console.log(self.database.list_by_theme_part("Gym"));
})
*/
