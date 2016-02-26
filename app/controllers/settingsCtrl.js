(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope'];

  function SettingsCtrl($scope) {
    console.log('Hello from SettingsCtrl!');
  }
}());