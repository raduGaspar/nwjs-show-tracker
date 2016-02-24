(function () {
  'use strict';

  angular
    .app
    .config(AppConfig)
    .run(AppRun);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  AppRun.$inject = ['$rootScope', '$state'];

  function AppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'app/partials/main.html',
        controller: 'MainCtrl'
      });
  }

  function AppRun($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, fromState, fromParams) {

    });
  }
}());