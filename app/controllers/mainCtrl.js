(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$state', 'hotkeys', 'L', 'Utils', 'SettingsServ'];

  function MainCtrl($scope, $state, hotkeys, L, Utils, SettingsServ) {
    console.log('Hello from MainCtrl!');

    // global hotkeys
    hotkeys
      .bindTo($scope) // this scope is shared by all sub-views, so it's ok
      .add({
        combo: 'ctrl+n',
        description: 'Add Show', // This won't work: L.translate('shortcuts.addShow')
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $state.go('main.add');
        }
      })
      .add({
        combo: 'ctrl+o',
        description: 'Open settings',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $state.go('main.settings');
        }
      })
      .add({
        combo: 'ctrl+l',
        description: 'Open shows list',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $state.go('main.list');
        }
      });

    var developMode,
      globals = Utils.getGlobals();

    $scope.settings = SettingsServ.get();
    $scope.L = L.translate;
    $scope.$watch('settings', function(newVal, oldVal) {
      console.log('settings changed', newVal);
      if(newVal) {
        SettingsServ.save();
      }
    }, true);

    // show data store for show add feature in 'list' and 'add' screens
    $scope.showData = {};

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      globals.win.showDevTools();
    }
  }
}());
