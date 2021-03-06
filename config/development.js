'use strict';

var config = {
    server: {
        port: 5567,
        host: 'f-test.kalaus.ru',
        protocol: 'http'
    },
    auth: {
        secret: 'x',
        scope: [
            'conversation:list',
            'conversation:show',
            'conversation:add',
            'message:list',
            'message:add',
            'user:show',
            'user:list'
        ]
    }
};

module.exports = config;