(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope'];

  function SettingsCtrl($scope) {
    console.log('Hello from SettingsCtrl!');
    $scope.otherTracker = {};
    $scope.trackers = [
      { url: 'http://kat.cr/usearch/', isDefault: true },
      { url: 'http://filelist.ro/browse.php?search=' }
    ];
    $scope.addTracker = function(model) {
      if(!model) { return; }
      $scope.trackers.push({ url: model });
      $scope.otherTracker.url = '';
    };
    $scope.deleteTracker = function(tracker) {
      $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
    };
  }
}());