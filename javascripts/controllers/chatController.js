'use strict';

/* global fTest, _, async */

fTest.

controller('chatController', ['userService', '$mdSidenav', '$location', '$routeParams', 'conversationService', 'messageService', '$timeout', 'toastr', 'socketService', function(userService, $mdSidenav, $location, $routeParams, conversationService, messageService, $timeout, toastr, socketService) {

    if (!userService.isLoggedIn()) {
        return $location.path('/user/login');
    }

    var chat = this;

    chat.conversations = [];
    chat.conversationId = Number($routeParams.id) || null;
    chat.conversation = null;
    chat.message = '';
    chat.member = '';
    chat.loading = false;

    chat.openSidenav = openSidenav;
    chat.sendMessage = sendMessage;

    function sendMessage() {

        chat.loading = true;

        var conversationNew = null;
        var conversationId = chat.conversationId;

        return async.series([
            function(next) {

                if (!chat.message) {
                    return next({message: 'Enter message'});
                }

                if (conversationId) {
                    return next();
                }

                if (!chat.member) {
                    return next({message: 'Enter email of chat partner'});
                }

                return conversationService.add({
                    member: chat.member
                }, function(err, conversation) {

                    if (err) {
                        return next({message: err.message});
                    }

                    conversationNew = conversation.conversationId;

                    return next();
                });
            },
            function(next) {

                if (conversationId || !conversationNew) {
                    return next();
                }

                return getConversations(function() {

                    var found = chat.conversations.filter(function(conversation) {

                        return conversation.conversationId === conversationNew;
                    });

                    conversationId = (found.length ? found[0] : chat.conversations[0]).conversationId;

                    return next();
                });
            },
            function(next) {

                return messageService.add({
                    conversationId: conversationId,
                    message: chat.message
                }, function(err) {

                    if (err) {
                        return next({message: 'Error sending message'});
                    }

                    if (conversationNew) {
                        return next();
                    }

                    chat.message = '';

                    $timeout(function() {

                        angular.element('.f-chat-message input').focus();
                    });

                    return next();
                });
            }
        ], function(err) {

            chat.loading = false;

            if (err) {
                return toastr.error(err.message);
            }

            if (conversationNew) {
                return $location.path('/conversation/' + conversationNew);
            }
        });
    }

    function openSidenav(id) {

        return $mdSidenav(id).toggle(true);
    }

    function getConversations(onSuccess) {

        onSuccess = onSuccess || angular.noop;

        return conversationService.list({}, function(err, list) {

            if (err) {
                return onSuccess();
            }

            chat.conversations = list;

            return onSuccess();
        });
    }

    function getConversation(onSuccess) {

        onSuccess = onSuccess || angular.noop;

        chat.conversation = null;

        if (!chat.conversationId) {
            return onSuccess();
        }

        chat.loading = true;

        return conversationService.show({
            conversationId: chat.conversationId
        }, function(err, card) {

            chat.loading = false;

            if (err) {
                return onSuccess();
            }

            chat.conversation = card;

            return getMessages(onSuccess);
        });
    }

    function getMessages(onSuccess) {

        onSuccess = onSuccess || angular.noop;

        return messageService.list({
            conversationId: chat.conversationId
        }, function(err, list) {

            if (err || !chat.conversation) {
                return onSuccess();
            }

            if (angular.isUndefined(chat.conversation.messages)) {
                chat.conversation.messages = [];
            }

            chat.conversation.messages = _.unionBy(chat.conversation.messages, list, 'messageId');

            $timeout(function() {

                var scroll = angular.element('.f-message-list').parent()[0];

                if (scroll) {
                    scroll.scrollTop = scroll.scrollHeight;
                }
            });

            return onSuccess();
        });
    }

    function init() {

        getConversations(function() {

            var found = chat.conversations.filter(function(conversation) {

                return conversation.conversationId === chat.conversationId;
            });

            if (!found.length && chat.conversationId) {
                return $location.path('/');
            }

            if (chat.conversationId) {
                getConversation();
            }

            socketService.io.on('f-conversation-added', function(data) {

                var hadConversations = chat.conversations.length;

                return getConversations(function() {

                    if (chat.conversationId && (hadConversations || chat.conversationId === data.conversationId)) {
                        return;
                    }

                    return $location.path('/conversation/' + data.conversationId);
                });
            });

            socketService.io.on('f-message-added', function(data) {

                if (chat.conversationId !== data.conversationId) {
                    return;
                }

                return getMessages();
            });
        });
    }

    init();
}]);
