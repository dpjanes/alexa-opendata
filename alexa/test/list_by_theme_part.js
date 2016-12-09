/*
 *  list_by_theme_part.js
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

describe("list_by_theme_part", function() {
    const sherbourne = require("./data/Sherbourne_Common.json")
    const warden = require("./data/Warden_Hilltop.json")

    const db = database.database()
    db.add(sherbourne)
    db.add(warden)
    
    it("exists (Park)", function() {
        const theme = "Park";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ sherbourne, warden ])
    });

    it("exists (PARK) - case doesn't matter", function() {
        const theme = "PARK";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ sherbourne, warden ])
    });

    it("does not exist (Park … Sport Field)", function() {
        const theme = "Park … Sport Field";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [])
    });
    it("exists (Sport Field)", function() {
        const theme = "Sport Field";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ warden ])
    });

    it("does not exist (Park … Garden)", function() {
        const theme = "Park … Garden";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ ])
    });
    it("exists (Garden)", function() {
        const theme = "Garden";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ warden ])
    });

    it("does not exist (Park … Rink)", function() {
        const theme = "Park … Rink";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ ])
    });
    it("exists (Rink)", function() {
        const theme = "Rink";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ sherbourne ])
    });

    it("does not exist (Park … Outdoor Rink)", function() {
        const theme = "Park … Outdoor Rink";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ ])
    });
    it("exists (Outdoor Rink)", function() {
        const theme = "Outdoor Rink";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ sherbourne ])
    });

    it("exists (OUTDOOR RINK) - case doesn't matter", function() {
        const theme = "OUTDOOR RINK";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, [ sherbourne ])
    });

    it("does not exist (Nowhere)", function() {
        const theme = "nowhere";
        const result = db.list_by_theme_part(theme);
        assert.deepEqual(result, []);
    });
});
