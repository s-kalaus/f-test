'use strict';

var config = require('../../config');
var SocketService = require('../services/socket');
var UserService = require('../services/user');
var UtilService = require('../services/util');

var UserApi = {

    list: function(req, res) {

        var utilService = new UtilService(config);
        var userService = new UserService(config);

        return userService.list(utilService.formatParams(req), function(result) {


            if (result && result.success) {

                result.data = result.data.map(function(user) {

                    delete user.passwordHash;
                    delete user.salt;

                    return user;
                });
            }

            return res.json(result);
        });
    },

    signin: function(req, res) {

        var socketService = new SocketService(config);
        var utilService = new UtilService(config);
        var userService = new UserService(config);

        return userService.signin(utilService.formatParams(req), function(result) {

            if (result.created) {

                userService.list({
                    userId: result.userId
                }, function(result) {

                    if (!result || !result.success) {
                        return;
                    }

                    result.data.forEach(function(user) {

                        socketService.emit(user.userId, 'f-user-added', {
                            userId: user.userId
                        });
                    });
                });
            }

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