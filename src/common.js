/*
 *  common.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-12
 *
 *  Common XML functions
 *
 *  Copyright [2013-2014] [David P. Janes]
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

const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const unirest = require('unirest')
const yaml = require('js-yaml');
const Q = require('q');

// --
const _load_configuration = (_self, done) => {
    const raw = fs.readFileSync(path.join(_self.folder, "configuration.yaml"), 'utf8');
    const cfgd = yaml.safeLoad(raw);

    const self = _.d.compose.shallow(cfgd, _self);

    done(null, self);
}

// --
const _load_data_from_file = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    try {
        self.body = fs.readFileSync(path.join(_self.folder, 'data.xml'), 'utf-8')
    } catch (x) {
        if (x.code !== 'ENOENT') {
            return done(x, self);
        }
    }

    done(null, self);
}

// --
const _load_data_from_url = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (self.body) {
        return done(null, self);
    }
    
    unirest
        .get(self.url)
        .end(result => {
            if (result.error) {
                return done(new Error(result.error), self);
            }

            self.body = result.body;
            return done(null, self);
        })
}

// --
const _parse_xml = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    
    const parser = new xml2js.Parser();
    parser.parseString(self.body, (error, result) => {
        if (error) {
            return done(error, self);
        }

        self.data = result;
        return done(null, self);
    });

}

// --
const _flatten_xml = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    
    const _flatten = o => {
        if (_.is.Array(o)) {
            if (o.length === 1) {
                return _flatten(o[0]);
            } else {
                return o.map(_flatten);
            }
        } else if (_.is.Object(o)) {
            return _.object(_.pairs(o).map(kv => [ kv[0], _flatten(kv[1]) ]))
        } else {
            return o;
        }
    };

    self.data = _flatten(self.data);
    return done(null, self);
}

const main = (compile) => {
    compile((error, result) => {
        if (error) {
            console.log("#", "error", _.error.message(error));
            return;
        }

        console.log(yaml.safeDump(result, { sortKeys: true }))
    });
}

const capwords = string => (string || "").replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

/**
 *  API
 */
exports.q_load_configuration = Q.denodeify(_load_configuration);
exports.q_load_data_from_file = Q.denodeify(_load_data_from_file);
exports.q_load_data_from_url = Q.denodeify(_load_data_from_url);
exports.q_parse_xml = Q.denodeify(_parse_xml);
exports.q_flatten_xml = Q.denodeify(_flatten_xml);

exports.main = main;
exports.capwords = capwords;
