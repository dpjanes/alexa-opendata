/*
 *  util.js
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

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const Q = require('q');

/**
 *  Accepts: self.resultds
 *  Produces: self.resultds
 *  
 *  This removes all items in resultds that don't have a latitude or longitude
 */
const _filter_ll = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.resultds, "limit: self.resultds required");

    self.resultds = self.resultds
        .filter(itemd => _.is.Number(itemd.latitude))
        .filter(itemd => _.is.Number(itemd.longitude));

    done(null, self);
};

/**
 *  Accepts: self.resultds, self.latitude, self.longitude
 *  Produces: self.resultds
 *  
 *  This sorts resultds by distance from latitude/longitude
 */
const _sort_by_distance = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.resultds, "sort_by_distance: self.resultds required");
    assert.ok(self.latitude, "sort_by_distance: self.latitude required");
    assert.ok(self.longitude, "sort_by_distance: self.longitude required");
    
    const sorted = self.resultds
        .map((resultd, index) => {
            assert.ok(_.is.Number(resultd.longitude))
            assert.ok(_.is.Number(resultd.latitude))

            const latitude_delta = resultd.latitude - self.latitude;
            const longitude_delta = resultd.longitude - self.longitude;
            return {
                index: index,
                latitude: resultd.latitude,
                longitude: resultd.longitude,
                distance: latitude_delta * latitude_delta + longitude_delta * longitude_delta,
            }
        })
        .sort((a, b) => _.is.unsorted(a.distance, b.distance));

    self.resultds = sorted.map(itemd => _self.resultds[itemd.index])

    done(null, self);
};

/**
 *  Accepts: self.resultds
 *  Produces: self.resultds
 *
 *  This is like UNIX "uniq" - it removes immediate duplicates
 */
const _uniq = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.resultds, "uniq: self.resultds required");

    self.resultds = self.resultds
        .reduce((itemds, itemd) => {
            if (itemds.length === 0) {
                return [ itemd ]
            } else if (itemds[itemds.length - 1].name === itemd.name) {
                return itemds
            } else {
                return itemds.concat([ itemd ])
            }
        }, [])

    done(null, self);
};

/**
 *  Accepts: self.resultds, self.n
 *  Produces: self.resultds
 *
 *  This limits resultds to at most n items
 */
const _limit = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.n, "limit: self.n required");
    assert.ok(self.resultds, "limit: self.resultds required");

    self.resultds = self.resultds.slice(0, self.n)

    done(null, self);
};

/**
 *  Accepts: self.resultds
 *  Produces: self.latitude, self.longitude
 *
 *  This makes the first result the center
 */
const _make_result_center = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.resultds, "make_result_center: self.resultds required");

    if (self.resultds.length === 0) {
        return done(new Error("not found"))
    }

    self.latitude = self.resultds[0].latitude;
    self.longitude = self.resultds[0].longitude;

    done(null, self);
};


/**
 *  API
 */
exports.filter_ll = Q.denodeify(_filter_ll);
exports.sort_by_distance = Q.denodeify(_sort_by_distance);
exports.make_result_center = Q.denodeify(_make_result_center);
exports.uniq = Q.denodeify(_uniq);
exports.limit = Q.denodeify(_limit);
