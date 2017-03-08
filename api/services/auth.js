'use strict';

var async = require('async');
var _ = require('lodash');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var AccessTokens = require('../models').AccessTokens;
var Users = require('../models').Users;

var AuthService = function(config) {

    this.config = config;
};

AuthService.prototype.oauthAuthorize = function(params, callback) {

    var _self = this;

    var validateJwt = expressJwt({
        secret: this.config.auth.secret
    });
    var authorization = params.req.headers.authorization;
    var token = 'error';
    var tokenRemote = null;
    var scopeRemote = params.scope;
    var customer = null;
    var user = null;

    return async.series([
        function(next) {

            if ((!scopeRemote || !scopeRemote.length) && !authorization) {
                return next(true);
            }

            if (!authorization) {
                return next({success: false, message: 'No authorization header'});
            }

            token = authorization.replace(/^Bearer\ /, '');

            if (!token) {
                return next({success: false, message: 'No token found in header'});
            }

            return validateJwt(params.req, params.req.res, function() {

                if (!params.req.user) {
                    return next({success: false, message: 'No token found'});
                }

                tokenRemote = params.req.user;

                return next();
            });
        },
        function(next) {

            return AccessTokens.findByToken(token, function(err, accessToken) {

                if (!accessToken) {
                    return next({success: false, message: 'No token found'});
                }


                if (!tokenRemote.userId || tokenRemote.userId !== accessToken.userId) {
                    return next({success: false, message: 'Token broken'});
                }

                return next();
            });
        },
        function(next) {

            return Users.findById(tokenRemote.userId, function(err, _user) {

                if (!_user) {
                    return next();
                }

                user = _user;

                return next();
            });
        },
        function(next) {

            if (!user && !customer) {
                return next({success: false, message: 'User not found'});
            }

            if (params.scope === 'all') {
                scopeRemote = _self.config.auth.scope;
            }

            var diff = _.difference(scopeRemote, _self.config.auth.scope);

            if (diff.length) {
                return next({success: false, message: 'Scope mismatch: ' + diff.join(', ')});
            }

            return next();
        }
    ], function(err) {

        if (err && err !== true) {

            return callback(err);
        }

        return callback({
            success: true,
            userId: user ? user.userId : null
        });
    });
};

AuthService.prototype.oauthCreateToken = function(params, callback) {

    var _self = this;

    var token = 'error';
    var user = null;
    var scopeRemote = [];
    var created = false;

    return async.series([
        function(next) {

            if (!params.scope) {
                return next({success: false, message: 'Scope not set'});
            }

            if (!params.email) {
                return next({success: false, message: 'Email not set'});
            }

            if (!params.name) {
                return next({success: false, message: 'Name not set'});
            }

            if (!params.password) {
                return next({success: false, message: 'Password not set'});
            }

            scopeRemote = params.scope.split(',');

            return next();
        },
        function(next) {

            return Users.findByEmail(params.email, function(err, _user) {

                if (!_user) {

                    var salt = Math.random().toString(36).substring(7);
                    var passwordHash = crypto.createHash('sha1').update(params.password + ':' + salt).digest('hex');

                    return Users.add(params.email, params.name, passwordHash, salt, function(err, _user) {

                        user = _user;
                        created = true;

                        return next();
                    });
                }

                if (_user.passwordHash !== crypto.createHash('sha1').update(params.password + ':' + _user.salt).digest('hex')) {
                    return next({success: false, message: 'Email / Password Invalid'});
                }

                user = _user;

                return next();
            });
        },
        function(next) {

            if (params.scope === 'all') {
                scopeRemote = _self.config.auth.scope;
            }

            var diff = _.difference(scopeRemote, _self.config.auth.scope);

            if (diff.length) {
                return next({success: false, message: 'Scope mismatch: ' + diff.join(', ')});
            }

            return next();
        },
        function(next) {

            return AccessTokens.findByUserIdScope(user.userId, params.scope, function(err, accessToken) {

                if (accessToken) {
                    token = accessToken.token;
                }

                return next();
            });
        },
        function(next) {

            if (token !== 'error') {
                return next();
            }

            token = jwt.sign({
                userId: user ? user.userId : null,
                string: Math.random().toString(36).substring(7)
            }, _self.config.auth.secret);

            return AccessTokens.create({
                token: token,
                userId: user.userId,
                scope: params.scope
            }, function() {

                return next();
            });
        }
    ], function(err) {

        if (err) {
            return callback(err);
        }

        return callback({
            success: true,
            userId: user.userId,
            token: token,
            redirect_uri: params.redirect_uri,
            state: params.state,
            created: true
        });
    });
};

module.exports = AuthService;

