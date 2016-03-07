(function() {
  'use strict';

  angular
    .app
    .controller('ListShowsCtrl', ListShowsCtrl);

  ListShowsCtrl.$inject = ['$scope', '$state', '$document', 'Utils', 'DB'];

  function ListShowsCtrl($scope, $state, $document, Utils, DB) {
    console.log('Hello from ListShowsCtrl!');
    /*
     * TODO:
     * 1. use a DB instead of JSON
     * 2. allow shows export/import to/from JSON
     * 3. pagination (maybe lazy loading) & filtering
     */
    var fileSaveTimeout,
      globals = Utils.getGlobals(),
      db = DB.getDb('shows'),
      scopeUpdate = function() {
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      },
      getEpisodeToView = function(show) {
        var ep = show.seasons[show.seasons.length-1].ep,
          se = show.seasons.length;
        ep = ep < 10 ? '0' + ep : ep;
        se = se < 10 ? '0' + se : se;

        return show.onlyEps ? ep : 's' + se + 'e' + ep;
      },
      doUpdate = function(show) {
        DB.update(db, { _id: show._id }, show).then(function(data) {
          console.log(data);
        }, Utils.onError);
      };

    $scope.showData = {
      name: undefined
    };

    $scope.getEpisodeToView = getEpisodeToView;
    $scope.selectedShow;

    $scope.selectShow = function(show) {
      $scope.selectedShow = show;
    };

    $scope.addShow = function() {
      console.log('addShow');
      $state.go('shows.add');
      scopeUpdate();
    };

    $scope.nextEpisode = function(show) {
      console.log('increase episode', show);
      var season = show.seasons[show.seasons.length-1];
      if($scope.pressedKey === 18 && !show.onlyEps) {
        show.seasons.push({ ep: 1 });
      } else {
        season.ep++;
      }

      doUpdate(show);
      return false;
    };

    $scope.prevEpisode = function(show) {
      console.log('decrease episode', show);
      var season = show.seasons[show.seasons.length-1];
      if(season.ep > 1) {
        season.ep--;
      } else {
        if(show.seasons.length > 1) {
          show.seasons.pop();
        }
      }

      doUpdate(show);
      return false;
    };

    $scope.searchTorrent = function(show) {
      var next = getEpisodeToView(show),
        searchFor = show.name + ' ' + next;
      console.log(searchFor);
      globals.gui.Shell.openExternal(
        'http://kat.cr/usearch/' +
        encodeURI(searchFor)
      );
    };

    $scope.deleteShow = function(show, idx) {
      DB.delete(db, show).then(function(data) {
        console.log('deleted show', data, show);
        $scope.shows.splice(idx, 1);
      });
    };

    // get all shows
    DB.find(db, {}).then(function(docs) {
      console.log('db shows data', docs);
      $scope.shows = docs;
      scopeUpdate();
    }, Utils.onError);
  }
}());