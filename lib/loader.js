/*
 *  loader.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-12
 *
 *  Common XML functions for Loading Data
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

const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const unirest = require('unirest')
const yaml = require('js-yaml');
const Q = require('q');
const assert = require("assert");

/**
 *  Accepts: self.folder
 *  Produces: self
 *
 *  Load `configuration.yaml` from the `folder` and composite
 *  it over `self`. Or in other words, set up `self`
 */
const load_configuration = (_self, done) => {
    assert.ok(_self.folder, "load_configuration: self.folder required");

    const raw = fs.readFileSync(path.join(_self.folder, "configuration.yaml"), 'utf8');
    const cfgd = yaml.safeLoad(raw);

    const self = _.d.compose.shallow(cfgd, _self);

    done(null, self);
}

/**
 *  Accepts: self.data_file || null, self.folder
 *  Produces: self.body
 *
 *  Loads the `data_file` - if it exists - into `body`.
 *  We often put this in front of a URL download
 *  to allow caching. 
 */
const load_data_from_file = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (!self.data_file) {
        return done(null, self);
    }

    assert.ok(self.folder, "load_data_from_file: self.folder required");
    
    try {
        self.body = fs.readFileSync(path.join(_self.folder, self.data_file), 'utf-8')
    } catch (x) {
        if (x.code !== 'ENOENT') {
            return done(x, self);
        }
    }

    done(null, self);
}

/**
 *  Accepts: self.url || null, self.body || null
 *  Produces: self.body
 *
 *  Will download `url` and put the contents in `body`.
 *  If the `body` is already there, it does nothing
 */
const load_data_from_url = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (!self.url) {
        return done(null, self);
    }

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

/**
 *  Accepts: self.body
 *  Produces: self.data
 *
 *  Turns XML (in `body`) into structured data (in `data`)
 */
const parse_xml = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.body, "parse_xml: self.body required");
    
    const parser = new xml2js.Parser();
    parser.parseString(self.body, (error, result) => {
        if (error) {
            return done(error, self);
        }

        self.data = result;
        return done(null, self);
    });

}

/**
 *  Accepts: self.data
 *  Produces: self.data
 *
 *  xml2js produces lots of stuff like: [ "string" ].
 *  Any array that just has one thing in it is
 *  "flattened" to just that string
 */
const flatten_xml = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.data, "flatten_xml: self.data required");
    
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

/**
 *  Accepts: self.body
 *  Produces: self.data
 *
 *  Parses the JSON in `body` into `data`
 */
const parse_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(self.body, "parse_json: self.body required");

    self.data = JSON.parse(self.body);

    return done(null, self);
}


/**
 *  This is a default main - it will run compile
 *  and print the results (as YAML) to the console
 */
const main = (compile) => {
    compile((error, itemds) => {
        if (error) {
            console.log("#", "error", _.error.message(error));
            console.log(error);
            return;
        }

        console.log(yaml.safeDump(itemds, { sortKeys: true, skipInvalid: true }))
    });
}

const capwords = string => (string || "").replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

/**
 *  API
 */
exports.load_configuration = Q.denodeify(load_configuration);
exports.load_data_from_file = Q.denodeify(load_data_from_file);
exports.load_data_from_url = Q.denodeify(load_data_from_url);
exports.parse_xml = Q.denodeify(parse_xml);
exports.parse_json = Q.denodeify(parse_json);
exports.flatten_xml = Q.denodeify(flatten_xml);

exports.main = main;
exports.capwords = capwords;
