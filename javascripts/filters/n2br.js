'use strict';

/* global fTest */

fTest.

filter('fn2br', function() {

    return function(text) {

        return text ? String(text).replace(/\n/g, '<br />') : '';
    };
});