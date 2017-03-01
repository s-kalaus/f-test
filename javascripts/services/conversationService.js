'use strict';

/* global fTest */

fTest.

factory('conversationService', ['conversationFactory', function(conversationFactory) {

    var Service = {};

    Service.list = list;
    Service.show = show;
    Service.add = add;

    function list(params, callback) {

        return conversationFactory.list(params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            return callback(null, result.data);
        }, callback);
    }

    function show(params, callback) {

        return conversationFactory.show(params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            return callback(null, result.data);
        }, callback);
    }

    function add(params, callback) {

        return conversationFactory.add(params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            return callback(null, result.data);
        }, callback);
    }

    return Service;
}]);