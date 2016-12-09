/*
 *  compile-dst.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-14
 *
 *  Compile all the src folders, storing the yaml in '../dst'
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
const yaml = require('js-yaml');

const Q = require('q');
const async = require('async');

const _is_directory = path => {
    try {
        return fs.statSync(path).isDirectory();
    } catch (x) {
        return false;
    }
};

const _is_file = path => {
    try {
        return fs.statSync(path).isFile();
    } catch (x) {
        return false;
    }
};

const _load_folders = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    fs.readdir(self.src_folder, (error, files) => {
        if (error) {
            return done(error, self);
        }

        self.folders = files
            .map(file => path.join(self.src_folder, file))
            .filter(folder => _is_directory)

        done(null, self);
    });

};
const load_folders = Q.denodeify(_load_folders);

const _mkdir_dst = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    if (_is_directory(self.dst_folder)) {
        return done(null, self);
    }

    fs.mkdir(self.dst_folder, (error) => {
        if (error) {
            return done(error, self);
        }

        return done(null, self);
    })
};
const mkdir_dst = Q.denodeify(_mkdir_dst);

const _run = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    const ops = self.folders
        .map(folder => ({
            folder: folder,
            name: path.basename(folder),
            path: path.join(folder, "compile.js"),
        }))
        .filter(fd => _is_file(fd.path))
        .map(fd => _.d.add(fd, "compile", require(fd.path).compile))
        .filter(fd => fd.compile)
        .map(fd => inner_done => {
            fd.compile((error, itemds) => {
                if (error) {
                    return inner_done(error)
                }

                const yaml_path = path.join(self.dst_folder, `${fd.name}.yaml`);
                fs.writeFileSync(yaml_path, yaml.safeDump(itemds, { sortKeys: true, skipInvalid: true }))

                console.log("+", "compiled", fd.name, yaml_path);
                inner_done(null);
            })
        })


    async.series(ops, (error) => {
        done(error, self);
    });
}
const run = Q.denodeify(_run);

// -- put it altogether
const compile = () => {
    Q({
        src_folder: path.join(__dirname, "..", "src"),
        dst_folder: path.join(__dirname, "..", "dst"),
        folder: __dirname,
    })
        .then(load_folders)
        .then(mkdir_dst)
        .then(run)
        .catch(error => {
            console.log("#", "error", _.error.message(error));
        })
        .done(self => {
            console.log("+", "done");
        })
}

/**
 *  API / Main
 */

compile()
