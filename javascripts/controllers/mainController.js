'use strict';

/* global fTest */

fTest.

controller('mainController', ['userService', function(userService) {

    var app = this;

    app.inited = false;
    app.userService = userService;

    function init() {

        userService.getUser({
            userId: 'me'
        }, function() {

            app.inited = true;
        });
    }

    return init();
}]);
