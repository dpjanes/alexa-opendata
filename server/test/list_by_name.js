/*
 *  list_by_name.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-24
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

const assert = require("assert")
const database = require("../database")

describe("list_by_name", function() {
    const sherbourne = require("./data/Sherbourne_Common.json")
    const warden = require("./data/Warden_Hilltop.json")

    const db = database.database()
    db.add(sherbourne)
    db.add(warden)
    
    it("exists (Sherbourne)", function() {
        const name = "Sherbourne Common";
        const result = db.list_by_name(name);
        assert.deepEqual(result, [ sherbourne ])
    });

    it("exists (Warden)", function() {
        const name = "Warden Hilltop Community Centre";
        const result = db.list_by_name(name);
        assert.deepEqual(result, [ warden ]);
    });

    it("exists (WARDEN) ... case doesn't matter", function() {
        const name = "WARDEN HILLTOP COMMUNITY CENTRE";
        const result = db.list_by_name(name);
        assert.deepEqual(result, [ warden ]);
    });

    it("does not exists (Nowhere)", function() {
        const name = "nowhere";
        const result = db.list_by_name(name);
        assert.deepEqual(result, []);
    });
});
