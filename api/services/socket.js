'use strict';

var _ = require('lodash');
var AuthService = require('./auth');

var SocketService = function(config) {

    this.io = null;
    this.config = config;

    this.socketByUserId = {};

    if (process.socketByUserId) {

        this.socketByUserId = process.socketByUserId;
    } else {

        process.socketByUserId = this.socketByUserId;
    }

    this.authService = new AuthService(config);
};

SocketService.prototype.setup = function(server) {

    var _self = this;

    this.io = require('socket.io')(server, {
        path: '/f-socket'
    });

    this.io.on('connection', function(socket) {

        function disconnect(_socket) {

            if (!_self.socketByUserId[_socket.userId]) {
                return;
            }

            var index = _.findIndex(_self.socketByUserId[_socket.userId], function(theSocket) {

                return theSocket.id === _socket.id;
            });

            if (index === -1) {
                return;
            }

            _self.socketByUserId[_socket.userId].splice(index, 1);
        }

        socket.on('setToken', function(data) {

            var token = data.token;

            return _self.authService.oauthAuthorize({
                req: {
                    headers: {
                        authorization: 'Bearer ' + token
                    }
                },
                scope: 'all'
            }, function(result) {

                if (!result || !result.success) {
                    return;
                }

                if (socket.userId) {

                    if (socket.userId === result.userId) {

                       return;
                    } else {

                        disconnect(socket);
                    }
                }
                socket.userId = result.userId;

                if (typeof _self.socketByUserId[result.userId] === 'undefined') {
                    _self.socketByUserId[result.userId] = [];
                }

                _self.socketByUserId[result.userId].push(socket);
            });
        });

        socket.on('disconnect', function() {

            disconnect(socket);
        });
    });
};

SocketService.prototype.emit = function(userId, type, data) {

    if (!this.socketByUserId[userId]) {
        return;
    }

    this.socketByUserId[userId].forEach(function(socket) {

        socket.emit(type, data);
    });
};

module.exports = SocketService;

