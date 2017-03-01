'use strict';

var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';

module.exports = _.extend({
    env: env
}, require('./' + env));