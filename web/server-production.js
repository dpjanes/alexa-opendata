/*
 *  server-production.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-17
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  Make sure to do 'npm run build' first!
 */

require('babel-register');
require("./server").server({
    webpack: false,
});

