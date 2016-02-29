(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$document', 'Utils', 'DB'];

  function MainCtrl($scope, $document, Utils, DB) {
    console.log('Hello from MainCtrl!');
    /*
     * TODO:
     * 1. use a DB instead of JSON
     * 2. allow shows export/import to/from JSON
     * 3. pagination (maybe lazy loading) & filtering
     */
    var developMode,
      fileSaveTimeout,
      globals = Utils.getGlobals(),
      db = DB.getDb('shows'),
      getEpisodeToView = function(show) {
        var ep = show.seasons[show.seasons.length-1].ep,
          se = show.seasons.length;
        ep = 'e' + (ep < 10 ? '0' + ep : ep);
        se = 's' + (se < 10 ? '0' + se : se);

        return se+ep;
      },
      pendingShowsListUpdate = function() {
        clearTimeout(fileSaveTimeout);
        fileSaveTimeout = setTimeout(updateShowsList, 3000);
      },
      updateShowsList = function() {
        globals.fs.writeFile(
          globals.dirname + '/shows.json',
          angular.toJson($scope.shows),
          Utils.onError
        );
      },
      // dummy shows data
      dummy = [
      {
        name: 'The Flash',
        airsOn: 'Wednesday',
        seasons: [
          {
            ep: 15
          }
        ]
      },
      {
        name: 'Game of Thrones',
        airsOn: 'Monday',
        seasons: [
          {
            ep: 10
          },
          {
            ep: 10
          },
          {
            ep: 10
          },
          {
            ep: 10
          },
          {
            ep: 10
          },
          {
            ep: 2
          }
        ]
      }
    ];

    DB.find(db, {}).then(function(data) {
      console.log('db shows data', data);
    }, Utils.onError);

    // shows data
    Utils.loadFile(globals.dirname + '/shows.json')
      .then(function(data) {
        // success
        console.log('data', data);
        $scope.shows = angular.fromJson(data) || dummy;
      }, function(reason) {
        // failed
        Utils.onError(reason);
        console.log('error', reason.message);
        console.log('using dummy data :)');
        $scope.shows = dummy;
      })
      .finally(function() {
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      });

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      globals.win.showDevTools();
    }

    $scope.days = Utils.defaults.weekdays;
    $scope.getEpisodeToView = getEpisodeToView;
    $scope.downloadTorrent = function(show) {
      var next = getEpisodeToView(show),
        searchFor = show.name + ' ' + next;
      console.log(searchFor);
      globals.gui.Shell.openExternal(
        'http://kat.cr/usearch/' +
        encodeURI(searchFor)
      );
    };
    $scope.prevEpisode = function(show) {
      var season = show.seasons[show.seasons.length-1];
      if(season.ep > 1) {
        season.ep--;
      } else {
        if(show.seasons.length > 1) {
          show.seasons.pop();
        }
      }

      pendingShowsListUpdate();
    };
    $scope.nextEpisode = function(show) {
      var season = show.seasons[show.seasons.length-1];
      if($scope.pressedKey === 18) {
        show.seasons.push({ ep: 1 });
      } else {
        season.ep++;
      }

      pendingShowsListUpdate();
    };

    // TODO: add show should be a different view with its own controller
    $scope.addShow = {
      name: undefined,
      airsOn: Utils.defaults.weekdays[new Date().getDay()],
      season: 1,
      episode: 1
    };
    $scope.saveShow = function(model) {
      var data = angular.copy(model),
        startSeason = data.season;
      data.seasons = [];

      // create an entry for every season
      for(var i=0; i<startSeason; i++) {
        data.seasons.push({ ep: 1 });
      }
      data.seasons[startSeason-1].ep = parseInt(data.episode);

      delete data.season;
      delete data.episode;

      console.log('show details', data);

      $scope.shows.push(data);

      // save to JSON
      pendingShowsListUpdate();

      // TODO: reset model
    };

    // keyboard events
    $document.bind('keydown', function(e) {
      $scope.pressedKey = e.which;
      $scope.$apply();
    });
    $document.bind('keyup', function(e) {
      $scope.pressedKey = null;
      $scope.$apply();
    });
  }
}());
