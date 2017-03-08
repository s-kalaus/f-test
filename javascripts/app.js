var fTest = angular.module('fTest', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngMaterial',
    'aPartial',
    'toastr'
]).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    fTest.env = '%env%';

    $routeProvider
        .when('/', {
            templateUrl: '../partials/chat/index.html',
            controller: 'chatController',
            controllerAs: 'chat'
        })
        .when('/conversation/:id', {
            templateUrl: '../partials/chat/index.html',
            controller: 'chatController',
            controllerAs: 'chat'
        })
        .when('/user/login', {
            templateUrl: '../partials/user/login.html',
            controller: 'userLoginController',
            controllerAs: 'vm'
        })
        .when('/user/:id', {
            template: '',
            controller: 'userConversationController'
        })
        .when('/user/logout', {
            template: '',
            controller: 'userLogioutController'
        })
        .when('/user', {
            templateUrl: '../partials/user/index.html',
            controller: 'userController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('authInterceptor');
}])
.factory('authInterceptor', ['$q', '$cookies', '$location', 'configService', function($q, $cookies, $location, configService) {

    return {

        request: function(config) {


            if (String(config.url).indexOf(configService.get('apiUrl')) === 0) {

                config.headers = config.headers || {};

                config.headers.Authorization = 'Bearer ' + $cookies.get('token');
            }

            return config;
        },

        responseError: function (response) {

            if (response.status === 403 && $location.path() !== '/user/login') {

                userService.logout();

                $location.path('/user/login');

                $cookies.remove('token');
            }

            return $q.reject(response);
        }
    };
}]);