/*
 *  server-dev.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-01
 *
 *  Copyright [2013-2017] [David P. Janes]
 */

require('babel-register');
require("./server").server({
    webpack: true,
});

