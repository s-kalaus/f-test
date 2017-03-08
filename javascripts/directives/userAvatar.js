'use strict';

/* global fTest, _ */

fTest.

directive('fUserAvatar', [function () {
    return {
        restrict: 'A',
        scope: {
            model: '=fUserAvatar',
            conversation: '=conversation'
        },
        template: [

            '{{ text }}'
        ].join(''),
        link: function($scope, element) {

            function init() {

                if (!$scope.model) {
                    return;
                }

                var colors = {
                    0: '#f78282',
                    1: '#82baf7',
                    2: '#8df782',
                    3: '#cccccc'
                };

                $scope.text = $scope.model.name.slice(0, 1).toUpperCase();

                var index = 0;

                if ($scope.conversation) {

                    index = _.findIndex($scope.conversation.members, function(member) {

                        return member.userId === $scope.model.userId;
                    });

                    if (index > 3 || index < 0) {
                        index = 3;
                    }
                }

                element.addClass('md-avatar').css({
                    backgroundColor: colors[index]
                });
            }

            $scope.$watch('conversation', init, true);
            $scope.$watch('model', init, true);
        }
    };
}]);