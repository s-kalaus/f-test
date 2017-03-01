'use strict';

/* global fTest */

fTest.

factory('socketService', [function() {

    var Service = {
        io: null
    };

    Service.init = function(token) {

        var _self = this;

        if (this.io) {

            return this.io.emit('setToken', {
                token: token
            });
        }

        this.io = io('/', {
            path: '/f-socket',
            reconnectionDelay: 3000
        });

        this.io.on('connect', function() {

            _self.io.emit('setToken', {
                token: token
            });
        });
    };

    return Service;
}]);