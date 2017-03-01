'use strict';

var _ = require('lodash');

var UtilService = function(config) {

    this.config = config;
};

UtilService.prototype.formatParams = function(req) {

    var ret = {};
    var params = req.swagger.params || {};

    for (var k in params) {
        ret[k] = params[k].value;
    }

    if (req.user && req.user.userId) {
        ret.userId = req.user.userId;
    }

    return ret;
};

module.exports = UtilService;

