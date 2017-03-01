'use strict';

var _ = require('lodash');
var moment = require('moment');

var data = [];

process.fCache.messages = data;

module.exports = {

    list: function(conversationId, callback) {

        var filtered = data.filter(function(item) {

            return item.conversationId === conversationId;
        });

        return callback(null, _.cloneDeep(filtered));
    },

    add: function(conversationId, userId, message, callback) {

        var item = {
            messageId: data.length + 1,
            conversationId: conversationId,
            message: message,
            owner: userId,
            date: (new moment()).format()
        };

        data.push(item);

        return callback(null, _.cloneDeep(item));
    }
};