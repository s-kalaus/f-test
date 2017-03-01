'use strict';

/* global fTest */

fTest.

directive('fConversationMembers', [function () {
    return {
        restrict: 'A',
        scope: {
            model: '=fConversationMembers'
        },
        template: [

            '<span ng-repeat="item in model">{{ ($index ? ", " : "") + item.email }}</span>'
        ].join('')
    };
}]);