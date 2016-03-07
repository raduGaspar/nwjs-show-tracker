(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'SettingsServ'];

  function SettingsCtrl($scope, SettingsServ) {
    console.log('Hello from SettingsCtrl!');
    var trackers,
      pre = 'http://',
      init = function() {
        $scope.trackerName = { url: pre };
        $scope.restoreDefaults = SettingsServ.reset;
        $scope.addTracker = function(url) {
          if(!url) { return; }
          trackers.list.push({ url: url });
          $scope.trackerName.url = pre;
        };
        $scope.deleteTracker = function(idx) {
          console.log(trackers);
          trackers.list.splice(idx, 1);
          if(idx && idx <= trackers.selected) {
            trackers.selected--;
          }
        };
      };

    SettingsServ.promise.then(function() {
      trackers = SettingsServ.get().trackers;
      init();
    });
  }
}());