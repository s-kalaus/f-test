'use strict';

var config = require('../../config');
var UserService = require('../services/user');
var UtilService = require('../services/util');

var UserApi = {

    signin: function(req, res) {

        var utilService = new UtilService(config);
        var userService = new UserService(config);

        return userService.signin(utilService.formatParams(req), function(result) {

            return res.json(result);
        });
    },

    show: function(req, res) {

        var utilService = new UtilService(config);
        var userService = new UserService(config);

        return userService.show(utilService.formatParams(req), function(result) {

            if (result && result.success) {
                delete result.data.passwordHash;
                delete result.data.salt;
            }

            return res.json(result);
        });
    }
};

module.exports = UserApi;