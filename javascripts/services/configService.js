'use strict';

/* global fTest */

fTest.

factory('configService', function() {

    var data = {
        get: function(key) {
            return data[key];
        }
    };

    _.assign(data, window.config, window.config[fTest.env]);

    delete data.envs;

    return data;
});