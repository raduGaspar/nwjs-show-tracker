(function() {
  'use strict';

  angular
    .app
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'Utils'];

  function SettingsCtrl($scope, Utils) {
    console.log('Hello from SettingsCtrl!');
    var globals = Utils.getGlobals(),
      dirname = globals.dirname,
      db = Utils.getDb('settings'),
      defaults = [
        { url: 'http://kat.cr/usearch/' },
        { url: 'http://filelist.ro/browse.php?search=' }
      ],
      toggleSelection = function(tracker) {
        console.log('toggleSelection', tracker);
        if(!tracker) {
          var selectedTracker = Utils.store('tracker');
          if(!selectedTracker) {
            console.log('select first tracker in list');
            Utils.store('tracker', $scope.trackers[0]._id);
            $scope.selected.tracker = $scope.trackers[0];
          } else {
            console.log('we have a tracker', selectedTracker);
            $scope.selected.tracker = Utils.findById($scope.trackers, selectedTracker);
          }
        } else {
          Utils.store('tracker', tracker._id);
          $scope.selected.tracker = Utils.findById($scope.trackers, tracker._id);
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
      insertDefaults = function() {
        db.insert(defaults, function(err, newDocs) {
          Utils.onError(err);
          console.log('newDocs', newDocs);
          updateView(newDocs);
        });
      },
      restoreDefaults = function() {
        localStorage.removeItem('tracker');

        // delete all entries
        db.remove({}, { multi: true }, function(err, numRemoved) {
          Utils.onError(err);
          console.log('removed', numRemoved);

          // restore defaults
          insertDefaults();
        });
      };

    console.log('current tracker', Utils.store('tracker'));
    // find all records
    db.find({}, function(err, docs) {
      Utils.onError(err);

      if(!docs.length) {
        // no data is available; insert defaults
        console.log('no data found, inserting defaults');
        insertDefaults();
      } else {
        console.log('data in db', docs);
        updateView(docs);
      }
    });

    $scope.otherTracker = {
      url: 'http://'
    };
    $scope.selected = {};
    $scope.restoreDefaults = restoreDefaults;
    $scope.toggleSelection = toggleSelection;
    $scope.addTracker = function(url) {
      if(!url) { return; }
      db.insert({ url: url }, function(err, newTracker) {
        Utils.onError(err);
        console.log('newTracker', newTracker);
        $scope.otherTracker.url = 'http://';
        updateView(newTracker);
      });
    };
    $scope.deleteTracker = function(tracker) {
      console.log('delete tracker', tracker);
      // TODO:
      // 1. if you delete a selected tracker, select the first one
      // 2. prevent deletion of all trackers
      db.remove({ _id: tracker._id }, {}, function(err, numRemoved) {
        Utils.onError(err);
        $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
        if(Utils.store('tracker') === tracker._id) {
          // remove localstorage tracker
          localStorage.removeItem('tracker');
        }
        updateView();
      });
    };
  }
}());