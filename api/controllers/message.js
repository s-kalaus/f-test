'use strict';

var async = require('async');
var config = require('../../config');
var SocketService = require('../services/socket');
var MessageService = require('../services/message');
var UtilService = require('../services/util');
var Users = require('../models').Users;
var Conversations = require('../models').Conversations;

function processMessage(item, done) {

    return async.waterfall([
        function(next) {

            return Users.findById(item.owner, function(err, owner) {

                delete owner.passwordHash;
                delete owner.salt;

                item.owner = owner;

                return next(null, item);
            });
        }
    ], done);
}

var MessageApi = {

    list: function(req, res) {

        var utilService = new UtilService(config);
        var messageService = new MessageService(config);

        return async.waterfall([
            function(next) {

                return messageService.list(utilService.formatParams(req), function(result) {

                    if (!result || !result.success) {
                        return next(result);
                    }

                    return next(null, result);
                });
            },
            function(result, next) {


                return async.map(result.data, processMessage, function(err, data) {

                    result.data = data;

                    return next(result);
                });
            }
        ], function(err, result) {

            if (err) {
                return res.json(err);
            }

            return res.json(result);
        });
    },

    add: function(req, res) {

        var socketService = new SocketService(config);
        var utilService = new UtilService(config);
        var messageService = new MessageService(config);

        var memberAdded = false;

        return async.waterfall([
            function(next) {

                return messageService.add(utilService.formatParams(req), function(result) {

                    if (!result || !result.success) {
                        return next(result);
                    }

                    memberAdded = result.memberAdded;

                    return next(null, result);
                });
            },
            function(result, next) {

                return Conversations.findById(result.data.conversationId, result.data.owner, function(err, item) {

                    if (item) {

                        item.members.forEach(function(member) {

                            socketService.emit(member, 'f-message-added', item);

                            if (memberAdded) {
                                socketService.emit(member, 'f-conversation-updated', item);
                            }
                        });
                    }

                    return next(null, result);
                });
            },
            function(result, next) {

                return processMessage(result.data, function(err, data) {

                    result.data = data;

                    return next(null, result);
                });
            }
        ], function(err, result) {

            if (err) {
                return res.json(err);
            }

            return res.json(result);
        });
    }
};

module.exports = MessageApi;