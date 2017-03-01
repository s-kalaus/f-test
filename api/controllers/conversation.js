'use strict';

var async = require('async');
var config = require('../../config');
var SocketService = require('../services/socket');
var ConversationService = require('../services/conversation');
var UtilService = require('../services/util');
var Users = require('../models').Users;

function processConversation(item, done) {

    return async.waterfall([
        function(next) {

            return Users.populateMembers(item.members, function(err, members) {

                item.members = members;

                return next(null, item);
            });
        },
        function(item, next) {

            return Users.findById(item.owner, function(err, owner) {

                delete owner.passwordHash;
                delete owner.salt;

                item.owner = owner;

                return next(null, item);
            });
        }
    ], done);
}

var ConversationApi = {

    list: function(req, res) {

        var utilService = new UtilService(config);
        var conversationService = new ConversationService(config);


        return async.waterfall([
            function(next) {

                return conversationService.list(utilService.formatParams(req), function(result) {

                    if (!result || !result.success) {
                        return next(result);
                    }

                    return next(null, result);
                });
            },
            function(result, next) {


                return async.map(result.data, processConversation, function(err, data) {

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

    show: function(req, res) {

        var utilService = new UtilService(config);
        var conversationService = new ConversationService(config);

        return async.waterfall([
            function(next) {

                return conversationService.show(utilService.formatParams(req), function(result) {

                    if (!result || !result.success) {
                        return next(result);
                    }

                    return next(null, result);
                });
            },
            function(result, next) {

                return processConversation(result.data, function(err, data) {

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
    },

    add: function(req, res) {

        var socketService = new SocketService(config);
        var utilService = new UtilService(config);
        var conversationService = new ConversationService(config);

        return async.waterfall([
            function(next) {

                return conversationService.add(utilService.formatParams(req), function(result) {

                    if (!result || !result.success) {
                        return next(result);
                    }

                    result.data.members.forEach(function(member) {

                        socketService.emit(member, 'f-conversation-added', result.data);
                    });

                    return next(null, result);
                });
            },
            function(result, next) {

                return processConversation(result.data, function(err, data) {

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

module.exports = ConversationApi;