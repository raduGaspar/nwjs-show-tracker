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
      .state('shows', {
        url: '/',
        templateUrl: 'app/partials/main.html',
        controller: 'MainCtrl'
      })
      .state('shows.add', {
        url: '/add',
        templateUrl: 'app/partials/addShow.html',
        controller: 'AddShowCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/partials/settings.html',
        controller: 'SettingsCtrl'
      });
  }

  function AppRun($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $state.current = toState;
    });
  }
}());