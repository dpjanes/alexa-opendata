/*
 *  firebase.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-24
 *
 *  Work with firebase
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

const firebase = require('firebase');
const Q = require('q');

const _connect = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.config, "firebase.connect: self.config required");
    assert.ok(self.config.firebase, "firebase.connect: self.config.firebase required");

    firebase.initializeApp(self.config.firebase)

    self.firebase = {
        db: firebase.database(),
    }

    done(null, self);
}

const _update_places = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.firebase, "firebase.update_places: self.firebase required");
    assert.ok(self.station, "firebase.update_places: self.station required");
    assert.ok(self.itemds, "firebase.update_places: self.itemds required");

    const ref = self.firebase.db.ref(`stations/${self.station}/places`);

    console.log("HERE:XXX", self.station);

    ref.set(self.itemds || [], (error) => {
        if (error) {
            done(error, self);
            return;
        }

        done(null, self);
    });
}

const _update_title = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.firebase, "firebase.update_title: self.firebase required");

    const ref = self.firebase.db.ref(`stations/${self.station}/query`);

    ref.set({
        title: self.title || null,
        name: self.name || null,
        theme: self.theme || null,
        theme_part: self.theme_part || null,
    }, (error) => {
        if (error) {
            done(error, self);
            return;
        }

        done(null, self);
    });
}

/**
 *  API
 */
exports.firebase = {};
exports.firebase.connect = Q.denodeify(_connect);
exports.firebase.update_places = Q.denodeify(_update_places);
exports.firebase.update_title = Q.denodeify(_update_title);
