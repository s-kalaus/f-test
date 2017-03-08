'use strict';

var _ = require('lodash');

var data = [];

process.fCache.users = data;

module.exports = {

    list: function(userId, callback) {

        var filtered = data.filter(function(item) {

            return item.userId !== userId;
        });

        return callback(null, _.cloneDeep(filtered));
    },

    findByEmail: function(email, callback) {

        var found = data.filter(function(item) {

            return item.email === email;
        });

        return callback(null, found.length ? _.cloneDeep(found[0]) : null);
    },

    findById: function(userId, callback) {

        var found = data.filter(function(item) {

            return item.userId === userId;
        });

        return callback(null, found.length ? _.cloneDeep(found[0]) : null);
    },

    add: function(email, name, passwordHash, salt, callback) {

        var item = {
            userId: data.length + 1,
            email: email,
            name: name,
            passwordHash: passwordHash,
            salt: salt
        };

        data.push(item);

        return callback(null, _.cloneDeep(item));
    },

    populateMembers: function(members, callback) {

        return callback(null, members.map(function(item) {

            var found = data.filter(function(theItem) {

                return theItem.userId === item;
            });

            var _user = _.cloneDeep(found[0]);

            delete _user.passwordHash;
            delete _user.salt;

            return _user;
        }));
    }
};