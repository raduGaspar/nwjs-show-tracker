(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$document'];

  function MainCtrl($scope, $document) {
    console.log('Hello from MainCtrl!');
    var developMode,
      fileSaveTimeout,
      gui = require('nw.gui'),
      fs = require('fs'),
      path = require('path'),
      dirname = path.dirname(),
      win = gui.Window.get(),
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

      // dummy shows data
      dummy = [
      {
        name: 'The Flash',
        seasons: [
          {
            ep: 15
          }
        ]
      },
      {
        name: 'Game of Thrones',
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

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      win.showDevTools();
    }

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
    $scope.addShow = function(model) {
      if($scope.filtered.length) { return; }
      console.log('addShow', model);
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

    // shows data
    fs.readFile(dirname + '/shows.json', 'utf8', function(err, data) {
      if(err) {
        $scope.err = err.message;
        console.log('error', err.message);
        console.log('using dummy data');
      }

      $scope.shows = angular.fromJson(data) || dummy;
    });
  }
}());
