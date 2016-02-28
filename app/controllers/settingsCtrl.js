(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'Utils', 'DB'];

  function SettingsCtrl($scope, Utils, DB) {
    console.log('Hello from SettingsCtrl!');
    var globals = Utils.getGlobals(),
      dirname = globals.dirname,
      db = DB.getDb('settings'),
      toggleSelection = function(tracker) {
        console.log('toggleSelection', tracker);
        if(tracker) {
          Utils.store('tracker', tracker._id);
          $scope.selected.tracker = Utils.findById($scope.trackers, tracker._id);
        } else {
          var selectedTracker = Utils.store('tracker');
          if(!selectedTracker) {
            console.log('select first tracker in list');
            Utils.store('tracker', $scope.trackers[0]._id);
            $scope.selected.tracker = $scope.trackers[0];
          } else {
            console.log('we have a tracker', selectedTracker);
            $scope.selected.tracker = Utils.findById($scope.trackers, selectedTracker);
          }
        }
      },
      updateView = function(data) {
        if(data) {
          if(data.length !== undefined) {
            $scope.trackers = data;
          } else {
            $scope.trackers.push(data);
          }
        }

        toggleSelection();

        if(!$scope.$$phase) {
          $scope.$apply();
        }
      },
      restoreDefaults = function() {
        DB.reset(db).then(function(newDocs) {
          console.log('newDocs', newDocs);
          updateView(newDocs);
        }, Utils.onError);
      };

    console.log('current tracker', Utils.store('tracker'));

    // find all records and restore defaults if no data is found
    DB.find(db, {}).then(function(docs) {
      docs.length ? updateView(docs) : restoreDefaults();
    }, Utils.onError);

    $scope.otherTracker = {
      url: 'http://'
    };
    $scope.selected = {};
    $scope.restoreDefaults = restoreDefaults;
    $scope.toggleSelection = toggleSelection;
    $scope.addTracker = function(url) {
      if(!url) { return; }

      DB.insert(db, { url: url }).then(function(newTracker) {
        $scope.otherTracker.url = 'http://';
        updateView(newTracker);
      }, Utils.onError);
    };
    $scope.deleteTracker = function(tracker) {
      console.log('delete tracker', tracker);
      // TODO:
      // 1. if you delete a selected tracker, select the first one
      DB.delete(db, { _id: tracker._id }).then(function(numRemoved) {
        $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
        if(Utils.store('tracker') === tracker._id) {
          // remove localstorage tracker
          localStorage.removeItem('tracker');
        }
        updateView();
      }, Utils.onError);
    };
  }
}());