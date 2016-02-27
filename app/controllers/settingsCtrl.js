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
      updateView = function(data) {
        if(data) {
          if(data.length !== undefined) {
            $scope.trackers = data;
          } else {
            $scope.trackers.push(data);
          }
        }

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
        // delete all entries
        db.remove({}, { multi: true }, function(err, numRemoved) {
          if(err) { console.log(err); }
          console.log('removed', numRemoved);

          // restore defaults
          insertDefaults();
        });
      };

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
      db.remove({ _id: tracker._id }, {}, function(err, numRemoved) {
        if(err) { console.log(err); }
        $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
        updateView();
      });
    };
    /*$scope.trackers = defaults;
    $scope.selected = {
      tracker: $scope.trackers[0]
    };
    /*
    $scope.deleteTracker = function(tracker) {
      $scope.trackers.splice($scope.trackers.indexOf(tracker), 1);
      // TODO: if you delete a selected tracker, select the first one
      // TODO: add logic to restore defaults (default tracker and selection)
    };
    $scope.toggleSelection = function(idx, tracker) {
      console.log(idx, tracker);
    };*/
  }
}());