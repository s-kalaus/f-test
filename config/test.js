'use strict';

var config = {
    server: {
        port: 5568,
        host: 'localhost',
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