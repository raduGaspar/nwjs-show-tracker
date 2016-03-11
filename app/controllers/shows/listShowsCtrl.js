(function() {
  'use strict';

  angular
    .app
    .controller('ListShowsCtrl', ListShowsCtrl);

  ListShowsCtrl.$inject = ['$scope', '$state', '$document', 'Utils', 'DB', 'SettingsServ'];

  function ListShowsCtrl($scope, $state, $document, Utils, DB, SettingsServ) {
    console.log('Hello from ListShowsCtrl!');
    /*
     * TODO:
     * 1. allow shows export/import to/from JSON
     * 2. pagination (maybe lazy loading) & filtering
     */

    var settings,
      globals = Utils.getGlobals(),
      showsDb = DB.getDb('shows'),
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
        DB.update(showsDb, { _id: show._id }, angular.copy(show))
          .then(function(res) {
            console.log('show update success', res);
          }, Utils.onError);
      },
      init = function() {
        settings = SettingsServ.get();

        $scope.showData = { name: undefined };
        $scope.getEpisodeToView = getEpisodeToView;

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
            settings.trackers.list[settings.trackers.selected].url +
            encodeURI(searchFor)
          );
        };

        $scope.deleteShow = function(show, idx) {
          DB.delete(showsDb, { _id: show._id }).then(function(data) {
            console.log('deleted show', data, show);
            $scope.shows.splice(idx, 1);
          });
        };

        // get all shows
        DB.find(showsDb, {}).then(function(docs) {
          console.log('showsDb shows data', docs);
          $scope.shows = docs;
          scopeUpdate();
        }, Utils.onError);
      };

    SettingsServ.promise.then(init, Utils.onError);
  }
}());