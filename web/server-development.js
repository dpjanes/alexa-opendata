/*
 *  server-development.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-17
 *
 *  Copyright [2013-2017] [David P. Janes]
 */

require('babel-register');
require("./server").server({
    use_webpack: true,
});

