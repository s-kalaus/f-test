'use strict';

/* global fTest, _ */

fTest.

factory('conversationFactory',  ['$resource', 'configService', function($resource, configService) {

    return $resource(configService.get('apiUrl') + '/conversation', {}, {
        list: {
            method: 'GET'
        },
        add: {
            method: 'POST'
        },
        show: {
            url: configService.get('apiUrl') + '/conversation/:conversationId',
            method: 'GET'
        }
    });
}]);