'use strict';

/* global __dirname */

var fs = require('fs');

var db = {};

process.fCache = {};

fs
    .readdirSync(__dirname)
    .filter(function (file) {

        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {

        var name = file.replace(/\.js$/i, '');

        db[name] = require('./' + name);
    });

module.exports = db;