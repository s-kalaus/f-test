'use strict';

/* global should */

describe('userService', function() {

    var configService, userService, $timeout, $httpBackend;

    beforeEach(angular.mock.module('fTest'));

    beforeEach(inject(['$injector', '$timeout', 'configService', 'userService', function($injector, _$timeout, _configService, _userService) {

        configService = _configService;

        userService = _userService;

        $timeout = _$timeout;

        $httpBackend = $injector.get('$httpBackend');
    }]));

    it('should fetch user profile', function(done) {

        angular.mock.inject(function() {

            $httpBackend
                .whenGET(configService.get('apiUrl') + '/user/me')
                .respond(200, {
                    success: true,
                    data: {
                        userId: 1
                    }
                });

            userService.getUser({
                userId: 'me'
            }, function(err, data) {

                should(err).be.falsy;
                should(data).have.property('userId', 1);

                return done();
            });

            $timeout.flush();
            $httpBackend.flush();
        });
    });
});