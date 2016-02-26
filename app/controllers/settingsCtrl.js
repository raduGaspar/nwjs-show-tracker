(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'Utils'];

  function SettingsCtrl($scope, Utils) {
    console.log('Hello from SettingsCtrl!');
    var globals = Utils.getGlobals();

    /*
     * TODO: persist settings to file
     * 1. should have 2 trackers by default
     * 2. must save new trackers to file
     * 3. must save selected tracker to file (index of tracker)
     */

    $scope.otherTracker = {};
    $scope.trackers = [
      { url: 'http://kat.cr/usearch/' },
      { url: 'http://filelist.ro/browse.php?search=' }
    ];
    $scope.selected = {
      tracker: $scope.trackers[0]
    };
    $scope.addTracker = function(model) {
      if(!model) { return; }
      $scope.trackers.push({ url: model });
      $scope.otherTracker.url = '';
    };
    $scope.deleteTracker = function(tracker) {
      $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
      // TODO: if you delete a selected tracker, select the first one
      // TODO: add logic to restore defaults (default tracker and selection)
    };
    $scope.toggleSelection = function(idx, tracker) {
      console.log(idx, tracker);
    };
  }
}());