(function () {
  'use strict';

  angular
    .app
    .config(AppConfig)
    .run(AppRun);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  AppRun.$inject = ['$rootScope', '$state'];

  function AppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/shows/list');
    $urlRouterProvider.when('/', '/shows/list');
    $urlRouterProvider.when('/shows', '/shows/list');
    $urlRouterProvider.otherwise('/shows/list');

    $stateProvider
      .state('shows', {
        abstract: true,
        url: '/shows',
        templateUrl: 'app/partials/main.html'
      })
      .state('shows.list', {
        url: '/list',
        templateUrl: 'app/partials/shows/list.html',
        controller: 'ListShowsCtrl'
      })
      .state('shows.add', {
        url: '/add',
        templateUrl: 'app/partials/shows/add.html',
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