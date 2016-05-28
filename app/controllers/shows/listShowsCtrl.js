(function() {
  'use strict';

  angular
    .app
    .controller('ListShowsCtrl', ListShowsCtrl);

  ListShowsCtrl.$inject = [
    '$scope', '$state', '$document', 'hotkeys', 'Utils',
    'DB', 'L', 'SettingsServ', 'ShowsServ'
  ];

  function ListShowsCtrl($scope, $state, $document, hotkeys, Utils, DB, L, SettingsServ, ShowsServ) {
    console.log('Hello from ListShowsCtrl!');

    hotkeys
      .bindTo($scope)
      .add({
        combo: 'ctrl+f',
        description: 'Focus the filter input',
        callback: function() {
          angular.element('.filter').focus();
        }
      })
      .add({
        combo: 'esc',
        description: 'Unfocus the filter input',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          angular.element('.filter').blur();
        }
      })
      .add({
        combo: 'ctrl+tab',
        description: 'Toggle between Today & All tabs',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $scope.showTodayOnly = !$scope.showTodayOnly;
        }
      });

    var settings = SettingsServ.get(),
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

        DB.update(showsDb, { _id: show._id }, showCopy)
          .then(function(res) {
            console.log('show update success', res);
          }, Utils.onError);
      };

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
      $state.go('main.add');
      scopeUpdate();
    };

    $scope.doNext = function(show, increaseSeason) {
      console.log('increase episode', show);
      var season = show.seasons[show.seasons.length-1];
      if(increaseSeason && !show.onlyEps) {
        show.seasons.push({ ep: 1 });
      } else {
        season.ep++;
      }

      doUpdate(show);
      return false;
    };

    $scope.doPrev = function(show) {
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

    $scope.deleteShow = function(show) {
      DB.delete(showsDb, { _id: show._id }).then(function(data) {
        console.log('deleted show', data, show);
        $scope.shows.splice($scope.shows.indexOf(show), 1);
      });
    };

    $scope.editShow = function(show) {
      console.log('edit', show);
      ShowsServ.setSelected(show);
      $state.go('main.add');
    };

    $scope.today = function() {
      return new Date().getDay();
    };

    $scope.trackers = settings.trackers;
    $scope.showTodayOnly = true;

    // get all shows
    DB.find(showsDb, {}).then(function(docs) {
      console.log('showsDb shows data', docs);
      // create a temporary object to hold all translatable values
      // this will allow filtering by day name based on current translation
      // it will not be stored in the DB
      for(var i=0; i<docs.length; i++) {
        docs[i]['_temp'] = docs[i]['_temp'] || {};
        docs[i]['_temp'].day = L.translate('weekdays')[docs[i].airsOn];
      }
      $scope.shows = docs;
      scopeUpdate();
    }, Utils.onError);
  }
}());