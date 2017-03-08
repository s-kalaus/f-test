'use strict';

/* global fTest */

fTest.

filter('fhtml', function($sce) {

    return function(text) {

        if (!text) {
            return;
        }

        return $sce.trustAsHtml(text.replace(/<[^>]*?script[^>]*?>/gi, ''));
    };
});