'use strict';

var Messages = require('../models').Messages;

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

    return Messages.add(params.conversationId, params.userId, params.message, function(err, item) {

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

module.exports = MessageService;

