'use strict';

var fs = require('fs');

var buildId = Number(String(fs.readFileSync(__dirname + '/../../.build')).trim());

module.exports = function(config) {

    return config.set({
        basePath: '../..',
        autoWatch: false,
        singleRun: true,
        colors: true,
        port: 9876,
        frameworks: ['mocha', 'should'],
        client: {
            mocha: {
                timeout : 10000
            },
            captureConsole: true
        },
        reporters: ['mocha'],
        browsers: [
            'PhantomJS'
        ],
        files: [
            'www/build/' + buildId + '/javascripts/all.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'tests/ui/services/user.js'
        ],
        exclude: [],
        logLevel: config.LOG_INFO
    });
};
