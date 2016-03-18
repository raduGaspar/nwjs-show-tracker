(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$state', '$document', 'hotkeys', 'L', 'Utils', 'SettingsServ'];

  function MainCtrl($scope, $state, $document, hotkeys, L, Utils, SettingsServ) {
    console.log('Hello from MainCtrl!');

    // global hotkeys
    hotkeys
      .bindTo($scope) // this scope is shared by all sub-views, so it's ok
      .add({
        combo: 'ctrl++',
        description: 'Add show',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $state.go('shows.add');
        }
      })
      .add({
        combo: 'ctrl+o',
        description: 'Open settings',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $state.go('settings');
        }
      })
      .add({
        combo: 'ctrl+l',
        description: 'Open shows list',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $state.go('shows.list');
        }
      });

    var developMode,
      globals = Utils.getGlobals();

    // keyboard events
    $document.bind('keydown', function(e) {
      $scope.pressedKey = e.which;
      $scope.$apply();
    });
    $document.bind('keyup', function(e) {
      $scope.pressedKey = null;
      $scope.$apply();
    });

    $scope.settings = SettingsServ.get();
    $scope.L = L.translate;
    $scope.$watch('settings', function(newVal, oldVal) {
      console.log('settings changed', newVal);
      if(newVal) {
        SettingsServ.save();
      }
    }, true);

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      globals.win.showDevTools();
    }
  }
}());
