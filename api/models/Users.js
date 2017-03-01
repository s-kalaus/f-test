'use strict';

var _ = require('lodash');

var data = [];

process.fCache.users = data;

module.exports = {

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

    add: function(email, passwordHash, salt, callback) {

        var item = {
            userId: data.length + 1,
            email: email,
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