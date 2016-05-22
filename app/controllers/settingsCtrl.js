(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', '$window', 'hotkeys', 'SettingsServ', 'DB', 'Utils', 'L'];

  function SettingsCtrl($scope, $window, hotkeys, SettingsServ, DB, Utils, L) {
    console.log('Hello from SettingsCtrl!');

    hotkeys
      .bindTo($scope)
      .add({
        combo: 'ctrl+e',
        description: 'Export all data',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          angular.element('.btn-export').trigger('click');
        }
      })
      .add({
        combo: 'ctrl+i',
        description: 'Import data',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          angular.element('.btn-import').trigger('click');
        }
      });

    var trackers = SettingsServ.get().trackers,
      pre = 'http://';

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
      if(input.files.length) {
        DB.export()
          .then(function(res) {
            var json = angular.toJson(Utils.cleanIds(res));
            return Utils.writeFile(input.files[0].path, json);
          }, Utils.onError)
          .then(function(file) {
            console.log('file saved to', file);
            Utils.onSuccess({
              message: L.translate('alerts.dataExport', { file: file })
            });

            // required for saving a file with the same name
            input.value = '';
          }, Utils.onError);
      }
    };
    $scope.doImport = function(input) {
      if(input.files.length) {
        Utils.readFile(input.files[0].path)
          .then(function(data) {
            return DB.import(angular.fromJson(data));
          }, Utils.onError)
          .then(function(res) {
            console.log('import result', res);
            // TODO: angular scope needs to be updated with the imported data
            // awful lazy solution
            $window.location.reload();
          }, Utils.onError);
      }
    };
    $scope.languages = L.languages;
    $scope.changeLanguage = L.loadLocale;
  }
}());