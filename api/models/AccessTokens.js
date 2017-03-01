'use strict';

var _ = require('lodash');

var data = [];

process.fCache.access_tokens = data;

module.exports = {

    findByToken: function(token, callback) {

        var found = data.filter(function(item) {

            return item.token === token;
        });

        return callback(null, found.length ? _.cloneDeep(found[0]) : null);
    },

    findByUserIdScope: function(userId, scope, callback) {

        var found = data.filter(function(item) {

            return item.userId === userId && item.scope === scope;
        });

        return callback(null, found.length ? _.cloneDeep(found[0]) : null);
    },

    create: function(item, callback) {

        data.push(item);

        return callback(null, _.cloneDeep(item));
    }
};