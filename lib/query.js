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

const Q = require('q');

const _query_name = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.database, "query_name: self.database required");
    assert.ok(self.n, "query_name: self.n required");
    assert.ok(self.latitude, "query_name: self.latitude required");
    assert.ok(self.longitude, "query_name: self.longitude required");
    assert.ok(self.name, "query_name: self.name required");

    self.itemds = self.database.list_by_name(self.name);
    if ((self.itemds.length === 0) && self.fuzzy) {
        self.itemds = self.database.list_by_name_fuzzy(self.name);
    }

    done(null, self);
}

const _query_theme_part = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.database, "query_theme_part: self.database required");
    assert.ok(self.n, "query_theme_part: self.n required");
    assert.ok(self.latitude, "query_theme_part: self.latitude required");
    assert.ok(self.longitude, "query_theme_part: self.longitude required");
    assert.ok(self.theme_part, "query_theme_part: self.theme_part required");

    self.itemds = self.database.list_by_theme_part(self.theme_part);
    if ((self.itemds.length === 0) && self.fuzzy) {
        self.itemds = self.database.list_by_theme_part_fuzzy(self.theme_part);
    }

    done(null, self);
}

/**
 *  API
 */
exports.query_name = Q.denodeify(_query_name);
exports.query_theme_part = Q.denodeify(_query_theme_part);
