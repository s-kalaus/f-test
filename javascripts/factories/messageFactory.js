'use strict';

/* global fTest, _ */

fTest.

factory('messageFactory',  ['$resource', 'configService', function($resource, configService) {

    return $resource(configService.get('apiUrl') + '/conversation/:conversationId/message', {}, {
        add: {
            method: 'POST'
        },
        list: {
            method: 'GET'
        }
    });
}]);