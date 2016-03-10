(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', '$window', 'SettingsServ', 'DB', 'Utils'];

  function SettingsCtrl($scope, $window, SettingsServ, DB, Utils) {
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
          console.log(arguments);
          trackers.list.splice(idx, 1);
          if(idx <= trackers.selected) {
            // prevent it from going under 0
            if(trackers.selected) {
              trackers.selected--;
            }
          }
        };
        $scope.doExport = function(input) {
          DB.export()
            .then(function(res) {
              var json = angular.toJson(Utils.cleanIds(res));
              return Utils.writeFile(input.files[0].path, json);
            }, Utils.onError)
            .then(function(file) {
              console.log('file saved to', file);
            }, Utils.onError);
        };
        $scope.doImport = function(input) {
          Utils.readFile(input.files[0].path)
            .then(function(data) {
              var data = angular.fromJson(data);
              return DB.import(data);
            }, Utils.onError)
            .then(function(res) {
              console.log('import result', res);
              // TODO: angular scope needs to be updated with the imported data
              // awful lazy solution
              $window.location.reload();
            }, Utils.onError);
        };
      };

    SettingsServ.promise.then(function() {
      trackers = SettingsServ.get().trackers;
      init();
    });
  }
}());