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
      updateSelectedTracker = function(tracker) {
        console.log('updateSelectedTracker', tracker);
        if(!tracker) {
          var selectedTracker = Utils.store('tracker');
          if(!selectedTracker) {
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

        updateSelectedTracker();

        if(!$scope.$$phase) {
          $scope.$apply();
        }
      },
      insertDefaults = function() {
        db.insert(defaults, function(err, newDocs) {
          if(err) { console.log(err); }
          console.log('newDocs', newDocs);
          updateView(newDocs);
        });
      },
      restoreDefaults = function() {
        localStorage.removeItem('tracker');

        // delete all entries
        db.remove({}, { multi: true }, function(err, numRemoved) {
          if(err) { console.log(err); }
          console.log('removed', numRemoved);

          // restore defaults
          insertDefaults();
        });
      };

    console.log('current tracker', Utils.store('tracker'));
    // find all records
    db.find({}, function(err, docs) {
      if(err) { console.log(err); }

      if(!docs.length) {
        // no data is available; insert defaults
        console.log('no data found, inserting defaults');
        insertDefaults();
      } else {
        console.log('data in db', docs);
        updateView(docs);
      }
    });

    $scope.otherTracker = {};
    $scope.selected = {};
    $scope.restoreDefaults = restoreDefaults;
    $scope.addTracker = function(url) {
      if(!url) { return; }
      db.insert({ url: url }, function(err, newTracker) {
        if(err) { console.log(err); }
        console.log('newTracker', newTracker);
        $scope.otherTracker.url = '';
        updateView(newTracker);
      });
    };
    $scope.deleteTracker = function(tracker) {
      console.log('delete tracker', tracker);
      // TODO:
      // 1. if you delete a selected tracker, select the first one
      // 2. prevent deletion of all trackers
      db.remove({ _id: tracker._id }, {}, function(err, numRemoved) {
        if(err) { console.log(err); }
        $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
        if(Utils.store('tracker') === tracker._id) {
          // remove localstorage tracker
          localStorage.removeItem('tracker');
        }
        updateView();
      });
    };
    $scope.toggleSelection = updateSelectedTracker;
  }
}());