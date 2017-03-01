'use strict';

var AuthService = require('./auth');
var Users = require('../models').Users;

var UserService = function(config) {

    this.config = config;

    this.authService = new AuthService(config);
};

UserService.prototype.signin = function(params, callback) {

    return this.authService.oauthCreateToken({
        email: params.email,
        password: params.password,
        scope: 'all'
    }, callback);
};

UserService.prototype.show = function(params, callback) {

    return Users.findById(params.userId, function(err, item) {

        if (!item) {

            return callback({
                success: false
            });
        }

        return callback({
            success: true,
            data: item
        });
    });
};

module.exports = UserService;

