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
    $urlRouterProvider.when('/main', '/main/episodes');
    $urlRouterProvider.otherwise('/main/episodes');

    $stateProvider
      .state('main', {
        url: '/main',
        controller: 'MainCtrl',
        templateUrl: 'app/partials/main.html',
        resolve: {
          i18n: ['L', function(L) {
            console.log('L loaded', L);
            return L.promise;
          }]
        }
      })
      .state('main.episodes', {
        url: '/episodes',
        templateUrl: 'app/partials/shows/episodes.html',
        controller: 'EpisodesCtrl'
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