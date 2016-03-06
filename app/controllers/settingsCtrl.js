(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'SettingsServ'];

  function SettingsCtrl($scope, SettingsServ) {
    console.log('Hello from SettingsCtrl!');

    $scope.trackerName = { url: 'http://' };
    $scope.restoreDefaults = SettingsServ.reset;
    $scope.addTracker = function(url) {
      if(!url) { return; }
      $scope.settings.trackers.list.push({ url: url });
      $scope.trackerName.url = 'http://';
    };
    $scope.deleteTracker = function(tracker, idx) {
      $scope.settings.trackers.list.splice(idx, 1);
      if($scope.settings.trackers.selected > $scope.settings.trackers.list.length - 1) {
        $scope.settings.trackers.selected = 0;
      }
    };
  }
}());