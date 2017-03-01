'use strict';

/* global fTest */

fTest.

factory('messageService', ['messageFactory', function(messageFactory) {

    var Service = {};

    Service.list = list;
    Service.add = add;

    function list(params, callback) {

        return messageFactory.list(params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            return callback(null, result.data);
        }, callback);
    }

    function add(params, callback) {

        var conversationId = params.conversationId;

        delete params.conversationId;

        return messageFactory.add({
            conversationId: conversationId
        }, params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            return callback(null, result.data);
        }, callback);
    }

    return Service;
}]);