'use strict';

var async = require('async');
var Conversations = require('../models').Conversations;
var Users = require('../models').Users;

var ConversationService = function(config) {

    this.config = config;
};

ConversationService.prototype.list = function(params, callback) {

    return Conversations.list({}, function(err, list) {

        return callback({
            success: true,
            data: list
        });
    });
};

ConversationService.prototype.show = function(params, callback) {

    return Conversations.findById(params.conversationId, params.userId, function(err, item) {

        if (!item) {

            return callback({
                success: false
            });
        }

        return callback({
            success: true,
            data: item
        });
    });
};

ConversationService.prototype.add = function(params, callback) {

    var memberId = null;
    var conversation = null;

    return async.series([
        function(next) {

            return Users.findByEmail(params.member, function(err, user) {

                if (!user) {
                    return next({success: false, message: 'Chat partner not found'});
                }

                memberId = user.userId;

                if (memberId === params.userId) {
                    return next({success: false, message: 'You can not chat with yourself'});
                }

                return next();
            });
        },
        function(next) {

            return Conversations.findByMembers(params.userId, memberId, function(err, item) {

                conversation = item;

                return next();
            });
        },
        function(next) {

            if (!conversation) {
                return next();
            }

            var memberNew = null;

            if (conversation.members.indexOf(memberId) === -1) {
                memberNew = memberId;
            } else if (conversation.members.indexOf(params.userId) === -1) {
                memberNew = params.userId;
            }

            if (!memberNew) {
                return next();
            }

            return Conversations.addMember(conversation.conversationId, memberNew, function(err, item) {

                conversation = item;

                return next();
            });
        },
        function(next) {

            return Conversations.add(params.userId, memberId, function(err, item) {

                conversation = item;

                return next();
            });
        }
    ], function(err) {

        if (err && err !== true) {
            return callback(err);
        }

        return callback({
            success: true,
            data: conversation
        });
    });
};

module.exports = ConversationService;

