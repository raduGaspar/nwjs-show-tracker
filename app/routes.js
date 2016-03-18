(function () {
  'use strict';

  angular
    .app
    .config(AppConfig)
    .run(AppRun);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  AppRun.$inject = ['$rootScope', '$state'];

  function AppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/main');
    $urlRouterProvider.when('/', '/main');
    $urlRouterProvider.when('/main', '/main/list');
    $urlRouterProvider.otherwise('/main/list');

    // TODO: add resolve logic for L, DB, SettingsServ (?)
    // TODO: reduce overall deps (?)

    $stateProvider
      .state('main', {
        url: '/main',
        abstract: true,
        controller: 'MainCtrl',
        templateUrl: 'app/partials/main.html',
        resolve: {
          i18n: ['L', function(L) {
            console.log('L loaded', L);
            return L.promise;
          }]
        }
      })
      .state('main.list', {
        url: '/list',
        templateUrl: 'app/partials/shows/list.html',
        controller: 'ListShowsCtrl'
      })
      .state('main.add', {
        url: '/add',
        templateUrl: 'app/partials/shows/add.html',
        controller: 'AddShowCtrl'
      })
      .state('main.settings', {
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