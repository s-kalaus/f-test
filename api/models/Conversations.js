'use strict';

var _ = require('lodash');

var data = [];

process.fCache.conversations = data;

module.exports = {

    list: function(params, callback) {

        return callback(null, _.cloneDeep(data));
    },

    findById: function(conversationId, userId, callback) {

        var found = data.filter(function(item) {

            return item.conversationId === conversationId;
        });

        return callback(null, found.length ? _.cloneDeep(found[0]) : null);
    },

    findByMembers: function(userId, memberId, callback) {

        var found = data.filter(function(item) {

            return item.members.indexOf(userId) !== -1 && item.members.indexOf(memberId) !== -1;
        });

        return callback(null, found.length ? _.cloneDeep(found[0]) : null);
    },

    add: function(userId, memberId, callback) {

        var item = {
            conversationId: data.length + 1,
            owner: userId,
            members: [ userId, memberId ]
        };

        data.push(item);

        return callback(null, _.cloneDeep(item));
    },

    addMember: function(conversationId, memberId, callback) {

        var found = data.filter(function(item) {

            return item.conversationId === conversationId;
        });

        if (!found.length) {
            return callback(null, null);
        }

        found[0].members = _.union(found[0].members, [ memberId ]);

        return callback(null, _.cloneDeep(found[0]));
    }
};