'use strict';

/* global fTest */

fTest.

directive('fConversationMembers', [function () {
    return {
        restrict: 'A',
        scope: {
            model: '=fConversationMembers',
            conversation: '=conversation'
        },
        template: [

            '<div ng-repeat="item in model" data-f-user-avatar="item" data-conversation="conversation"></div>'
        ].join('')
    };
}]);