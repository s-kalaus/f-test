'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var async = require('async');
var config = require('../config');
var content = require('./content');
var UserService = require('../api/services/user');

describe('user', function () {

    beforeEach(function (done) {

        return done();
    });

    afterEach(function(done) {

        return done();
    });

    it('Should not add user without email', function(done) {

        var userService = new UserService(config);

        return async.series([
            function(next) {

                return userService.signin({}, function(result) {

                    result.should.have.property('success', false);

                    return next();
                });
            }
        ], function() {

            return done();
        });
    });

    it('Should add user on signin', function(done) {

        var userService = new UserService(config);

        return async.series([
            function(next) {

                return userService.signin(content.user.regular, function(result) {

                    result.should.have.property('success', true);

                    return next();
                });
            },
            function(next) {

                return userService.show({
                    userId: 1
                }, function(result) {

                    result.should.have.property('success', true);

                    return next();
                });
            }
        ], function() {

            return done();
        });
    });

    it('Should not add user with existing email on signin', function(done) {

        var userService = new UserService(config);

        return async.series([
            function(next) {

                return userService.signin(content.user.regular, function(result) {

                    result.should.have.property('success', true);

                    return next();
                });
            },
            function(next) {

                return userService.show({
                    userId: 1
                }, function(result) {

                    result.should.have.property('success', true);

                    return next();
                });
            },
            function(next) {

                return userService.signin({
                    email: content.user.regular.email,
                    password: 'Another Pwd'
                }, function(result) {

                    result.should.have.property('success', false);

                    return next();
                });
            }
        ], function() {

            return done();
        });
    });
});
