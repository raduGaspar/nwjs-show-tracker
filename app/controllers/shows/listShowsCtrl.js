(function() {
  'use strict';

  angular
    .app
    .controller('ListShowsCtrl', ListShowsCtrl);

  ListShowsCtrl.$inject = ['$scope', '$state', '$document', 'Utils', 'DB', 'L', 'SettingsServ'];

  function ListShowsCtrl($scope, $state, $document, Utils, DB, L, SettingsServ) {
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
        var showCopy = angular.copy(show);
        delete showCopy.temp; // don't store any of the temporary values

        DB.update(showsDb, { _id: show._id }, showCopy)
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

        $scope.showActions = function(show) {
          var ssa = $scope.activeShowActions;
          if(ssa && ssa._id === show._id) {
            $scope.activeShowActions = null;
          } else {
            $scope.activeShowActions = show;
          }
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

        $scope.editShow = function(show, idx) {
          console.log('edit', show);
        };

        $scope.today = function() {
          return new Date().getDay();
        };

        $scope.showTodayOnly = true;

        // get all shows
        DB.find(showsDb, {}).then(function(docs) {
          console.log('showsDb shows data', docs);
          // create a temporary object to hold all translatable values
          // this will allow filtering by day name based on current translation
          for(var i=0; i<docs.length; i++) {
            docs[i].temp = docs[i].temp || {};
            docs[i].temp.day = L.translate('weekdays')[docs[i].airsOn];
          }
          $scope.shows = docs;
          scopeUpdate();
        }, Utils.onError);
      };

    SettingsServ.promise
      .then(function() {
        return L.promise;
      }, Utils.onError)
      .then(init, Utils.onError);
  }
}());