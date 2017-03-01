'use strict';

/* global fTest */

fTest.

directive('fMessagesListHeight', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function($scope, element) {

            var parent = element.parent();

            function getHeight() {

                return (element.height() || 0) + 40;
            }

            $scope.$watch(getHeight, function() {

                $timeout(function() {

                    var heightNew = parent.height() - getHeight();

                    element.css({
                        marginTop: (heightNew > 0 ? heightNew : 0) + 'px'
                    });
                });
            });
        }
    };
}]);