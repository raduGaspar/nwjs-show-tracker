(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$document', 'Utils'];

  function MainCtrl($scope, $document, Utils) {
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
      gui = globals.gui,
      fs = globals.fs,
      path = globals.path,
      dirname = globals.dirname,
      win = globals.win,
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
        fs.writeFile(
          dirname + '/shows.json',
          angular.toJson($scope.shows),
          function(err) {
            if(err) {
              $scope.err = err;
              console.log('error', err);
            }
          }
        );
      },
      days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ],
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

    // shows data
    Utils.loadFile(dirname + '/shows.json')
      .then(function(data) {
        // success
        console.log('data', data);
        $scope.shows = angular.fromJson(data) || dummy;
      }, function(reason) {
        // failed
        $scope.err = reason.message;
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
      win.showDevTools();
    }

    $scope.days = days;
    $scope.getEpisodeToView = getEpisodeToView;
    $scope.downloadTorrent = function(show) {
      var next = getEpisodeToView(show),
        searchFor = show.name + ' ' + next;
      console.log(searchFor);
      gui.Shell.openExternal('http://kat.cr/usearch/' + encodeURI(searchFor));
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
    $scope.addShow = {
      name: undefined,
      airsOn: days[new Date().getDay()],
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
