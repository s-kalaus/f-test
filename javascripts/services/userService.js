'use strict';

/* global fTest */

fTest.

factory('userService', ['userFactory', '$location', '$cookies', 'socketService', function(userFactory, $location, $cookies, socketService) {

    var _guest = {
        userId: 0,
        email: 'noreply@service.com',
        name: 'Guest'
    };

    var Service = {
        user: angular.copy(_guest)
    };

    Service.isLoggedIn = isLoggedIn;
    Service.getUser = getUser;
    Service.logout = logout;
    Service.login = login;
    Service.signin = signin;

    function isLoggedIn() {

        return !!Service.user.userId;
    }

    function logout() {

        Service.user = angular.copy(_guest);

        $cookies.remove('token');

        login();
    }

    function login() {

        $location.path('/user/login');
    }

    function signin(params, callback) {

        callback = callback || angular.noop;

        return userFactory.signin(params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            $cookies.put('token', result.token);

            return getUser({
                userId: 'me'
            }, callback);
        }, callback);
    }

    function getUser(params, callback) {

        callback = callback || angular.noop;

        return userFactory.show(params, function(result) {

            if (!result.success) {
                return callback(result);
            }

            Service.user = result.data;

            socketService.init($cookies.get('token'));

            return callback(null, result.data);
        }, callback);
    }

    return Service;
}]);