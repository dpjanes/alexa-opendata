/*
 *  database.js
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

const assert = require("assert");
const Fuse = require("fuse.js")

const _theme_parts = theme => theme.split(" … ");

const _all_subthemes = theme => {
    const parts = _theme_parts(theme);

    const all_subparts = parts.reduce((accumulator, current) => {
        if (accumulator.length === 0) {
            return [ [ current ] ]
        } else {
            return accumulator.concat([ accumulator[accumulator.length - 1].concat([ current ]) ])
        }
    }, [])

    return all_subparts.map(subparts => subparts.join(" … "));
}

const _add_list = (ds, key, value) => {
    let s = ds[key]
    if (!s) {
        s = []
        ds[key] = s;
    }

    if (s.indexOf(value) === -1) {
        s.push(value)
    }
}

/**
 *  Returns an (empty) database object
 */
const database = () => {
    const self = Object.assign({});

    let _count = 0;
    const _db_item = {};
    const _db_themes = {};
    const _db_theme_parts = {};
    const _db_names = {};

    self.add = _itemd => {
        const itemd = _.d.clone.deep(_itemd);
        
        const themes = _.d.list(itemd, "_theme")
        if (_.is.Empty(themes)) {
            // console.log("warning: no _theme");
            return;
        }
        
        const id = _.d.first(itemd, "_id")
        if (_.is.Empty(id)) {
            console.log("warning: no _id");
            return;
        }
        
        const name = _.d.first(itemd, "name")
        if (_.is.Empty(name)) {
            console.log("warning: no name");
            return;
        }

        _db_item[id] = itemd;

        _add_list(_db_names, name.toLowerCase(), id);

        _.flatten(themes.map(_all_subthemes), true)
            .map(subtheme => subtheme.toLowerCase())
            .forEach(subtheme => _add_list(_db_themes, subtheme, id))

        _.flatten(themes.map(_theme_parts), true)
            .map(theme_part => theme_part.toLowerCase())
            .forEach(theme_part => _add_list(_db_theme_parts, theme_part, id));

        _count++;

    }

    self.get_by_id = id => _db_item[id] || null;

    const _retrieve = ids => (ids || [])
        .map(id => _db_item[id])
        .filter(d => d);

    const _fuzzy = (search, mapping) => {
        const keys = _.keys(mapping);

        const _searcher = new Fuse(keys, {
            threshold: 0.1,
        })

        const ids = _searcher.search(search)
            .map(index => keys[index])
            .map(key => mapping[key])

        return _.uniq(_.flatten(ids).sort())
            .map(id => _db_item[id])
    }


    self.list_by_theme = theme => _retrieve(_db_themes[theme.toLowerCase()])
    self.list_by_theme_part = theme_part => _retrieve(_db_theme_parts[theme_part.toLowerCase()])
    self.list_by_name = name => _retrieve(_db_names[name.toLowerCase()])

    self.list_by_theme_part_fuzzy = theme_part => _fuzzy(theme_part, _db_theme_parts)
    self.list_by_name_fuzzy = name => _fuzzy(name, _db_names)

    self.themes = () => _.keys(_db_themes);
    self.theme_parts = () => _.keys(_db_theme_parts);
    self.names = () => _.keys(_db_names);

    self.dump = () => {
        console.log("+", "_db_names")
        console.log(JSON.stringify(_db_names, null, 2))
        console.log("+", "_db_themes")
        console.log(JSON.stringify(_db_themes, null, 2))
        console.log("+", "_db_theme_parts")
        console.log(JSON.stringify(_db_theme_parts, null, 2))
    }

    self.count = () => _count;


    return self;
};

/**
 *  API
 */
exports.database = database;
