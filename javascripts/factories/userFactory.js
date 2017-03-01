'use strict';

/* global fTest, _ */

fTest.

factory('userFactory',  ['$resource', 'configService', function($resource, configService) {

    return $resource(configService.get('apiUrl') + '/user', {}, {

        show: {
            url: configService.get('apiUrl') + '/user/:userId',
            method: 'GET'
        },

        signin: {
            url: configService.get('apiUrl') + '/user/signin',
            method: 'POST'
        }
    });
}]);