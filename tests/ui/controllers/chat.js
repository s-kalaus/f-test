'use strict';

/* global should */

describe('chatController', function() {

    var controller, scope;

    beforeEach(angular.mock.module('fTest'));

    beforeEach(inject(['$controller', '$rootScope', function($controller, $rootScope) {

        scope = $rootScope.$new();

        //should(scope).be.truthy;

        controller = $controller('chatController', {
            $scope: scope
        });
    }]));

    it('should chatController exists', function(done) {

        angular.mock.inject(function() {

            //should(controller).to.exist;

            return done();
        });
    });
});