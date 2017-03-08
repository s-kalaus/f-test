'use strict';

var async = require('async');

var Messages = require('../models').Messages;
var Conversations = require('../models').Conversations;

var MessageService = function(config) {

    this.config = config;
};

MessageService.prototype.list = function(params, callback) {

    return Messages.list(params.conversationId, function(err, list) {

        return callback({
            success: true,
            data: list
        });
    });
};

MessageService.prototype.add = function(params, callback) {

    var conversation = null;
    var message = null;
    var memberAdded = false;

    return async.series([
        function(next) {

            return Conversations.findById(params.conversationId, null, function(err, _conversation) {

                if (!_conversation) {
                    return next({success: false, message: 'Conversation not found'});
                }

                conversation = _conversation;

                return next();
            });
        },
        function(next) {

            if (conversation.members.indexOf(params.userId) !== -1) {
                return next();
            }

            return Conversations.addMember(conversation.conversationId, params.userId, function(err, item) {

                conversation = item;

                memberAdded = true;

                return next();
            });
        },
        function(next) {

            return Messages.add(conversation.conversationId, params.userId, params.message, function(err, _message) {

                if (!_message) {
                    return next({success: false, message: 'Message Not Created'});
                }

                message = _message;

                return next();
            });
        }
    ], function(err) {

        if (err && err !== true) {
            return callback(err);
        }

        return callback({
            success: true,
            memberAdded: true,
            data: message
        });
    });


};

module.exports = MessageService;

