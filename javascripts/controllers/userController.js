'use strict';

/* global fTest, async */

fTest.

controller('userController', ['userService', '$location', function(userService, $location) {

    if (!userService.isLoggedIn()) {
        return $location.path('/user/login');
    }

    var vm = this;

    vm.card = null;

    vm.submit = submit;

    function submit() {

        return userService.update(vm.card, function(err) {

            if (err) {
                return;
            }

            $location.path('/');
        });
    }


    function init() {

        vm.card = angular.copy(userService.user);
    }

    return init();
}]).

controller('userLoginController', ['userService', '$location', 'toastr', function(userService, $location, toastr) {

    var vm = this;

    vm.submit = submit;

    vm.card = {
        email: '',
        name: '',
        password: ''
    };

    function submit() {

        return userService.signin(vm.card, function(err) {

            if (err) {
                return toastr.error(err.message);
            }

            $location.path('/');
        });
    }

    function init() {

    }

    return init();
}]).

controller('userConversationController', ['conversationService', 'userService', '$location', '$routeParams', 'toastr', function(conversationService, userService, $location, $routeParams, toastr) {

    if (!userService.isLoggedIn()) {
        return $location.path('/user/login');
    }

    var conversations = [];
    var userId = Number($routeParams.id) || null;
    var member = null;
    var conversation = null;

    return async.series([
        function(next) {

            return conversationService.list({}, function(err, list) {

                if (err) {
                    return onSuccess();
                }

                conversations = list;

                return next();
            });
        },
        function(next) {

            var found = conversations.filter(function(conversation) {

                if (conversation.members.length !== 2) {
                    return false;
                }

                return !!conversation.members.filter(function(user) {

                    var isEqual = user.userId === userId;

                    if (isEqual) {
                        member = user;
                    }

                    return isEqual;
                }).length;
            });

            if (found.length) {
                conversation = found[0];
            }

            return next();
        },
        function(next) {

            if (conversation) {
                return next();
            }

            return userService.show({
                userId: userId
            }, function(err, _user) {

                if (err) {
                    return next({message: err.message});
                }

                member = _user;

                return next();
            });
        },
        function(next) {

            if (conversation) {
                return next();
            }

            return conversationService.add({
                member: member.email
            }, function(err, _conversation) {

                if (err) {
                    return next({message: err.message});
                }

                conversation = _conversation;

                return next();
            });
        }
    ], function(err) {

        if (err) {
            return toastr.error(err.message);
        }

        return $location.path('/conversation/' + conversation.conversationId);
    });
}]);
