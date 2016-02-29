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
      };

    // get all shows
    DB.find(db, {}).then(function(docs) {
      console.log('db shows data', docs);
      $scope.shows = docs;
      scopeUpdate();
    }, Utils.onError);

    $scope.addShow = function() {
      var toState = 'shows.add';
      if($state.current.name !== toState) {
        console.log('addShow');
        $state.go(toState);
        scopeUpdate();
      }
    };

    $scope.showData = {
      name: undefined
    };

    $scope.getEpisodeToView = getEpisodeToView;

    // $scope.downloadTorrent = function(show) {
    //   var next = getEpisodeToView(show),
    //     searchFor = show.name + ' ' + next;
    //   console.log(searchFor);
    //   globals.gui.Shell.openExternal(
    //     'http://kat.cr/usearch/' +
    //     encodeURI(searchFor)
    //   );
    // };
    // $scope.prevEpisode = function(show) {
    //   var season = show.seasons[show.seasons.length-1];
    //   if(season.ep > 1) {
    //     season.ep--;
    //   } else {
    //     if(show.seasons.length > 1) {
    //       show.seasons.pop();
    //     }
    //   }

    //   pendingShowsListUpdate();
    // };
    // $scope.nextEpisode = function(show) {
    //   var season = show.seasons[show.seasons.length-1];
    //   if($scope.pressedKey === 18) {
    //     show.seasons.push({ ep: 1 });
    //   } else {
    //     season.ep++;
    //   }

    //   pendingShowsListUpdate();
    // };

    // // TODO: add show should be a different view with its own controller
  }
}());