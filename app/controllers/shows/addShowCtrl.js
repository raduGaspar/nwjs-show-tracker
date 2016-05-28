(function() {
  'use strict';

  angular
    .app
    .controller('AddShowCtrl', AddShowCtrl);

  AddShowCtrl.$inject = ['$scope', '$state', '$http', '$timeout', 'hotkeys', 'Utils', 'DB', 'ShowsServ'];

  function AddShowCtrl($scope, $state, $http, $timeout, hotkeys, Utils, DB, ShowsServ) {
    console.log('Hello from AddShowCtrl!');

    var globals = Utils.getGlobals(),
      urls = globals.urls,
      db = DB.getDb('shows'),
      editingShow = ShowsServ.getSelected(),
      scopeUpdate = function() {
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      },
      gotoShows = function() {
        $state.go('main.list');
        scopeUpdate();
      },
      doClose = function() {
        ShowsServ.setSelected(null);
        Utils.emptyObject($scope.showDetails);
        gotoShows();
      },
      onShowSelected = function(show) {
        return $http.get(urls.omdbapi, {
          params: {
            i: show.imdbID,
            plot: 'short',
            r: 'json'
          }
        }).then(function(res) {
          var sd = $scope.showData,
            genre = res.data.Genre;
          console.log('show details', res.data);
          // auto populate tags with show genre
          if(genre) {
            sd.tags = sd.tags || [];
            var genreTags = genre.split(', ');
            for(var i=0; i<genreTags.length; i++) {
              sd.tags.push({ text: genreTags[i].toLowerCase() });
            }
          }
        }, Utils.onError);
      };

    if(editingShow) {
      var seasons = editingShow.seasons.length;
      editingShow.season = seasons;
      editingShow.episode = editingShow.seasons[seasons-1].ep;
    }

    $scope.editingShow = editingShow;
    $scope.showDetails = editingShow || angular.extend($scope.showData, {
      airsOn: new Date().getDay(),
      season: 1,
      episode: 1
    });
    $scope.doSave = function(model) {
      if(!model.name) { return; }

      console.log('save show', model);
      var data = angular.copy(model),
        startSeason = data.onlyEps ? 1 : data.season;
      data.seasons = [];

      // create an entry for every season
      for(var i=0; i<startSeason; i++) {
        data.seasons.push({ ep: 1 });
      }
      data.seasons[startSeason-1].ep = +data.episode;

      delete data.season;
      delete data.episode;

      if(editingShow) {
        DB.update(db, { _id: data._id }, data).then(function(res) {
          console.log('show updated', res);
          doClose();
        });
      } else {
        DB.insert(db, data).then(function(newShow) {
          console.log('new show added', newShow);
          doClose();
        }, Utils.onError);
      }
    };
    $scope.doCancel = doClose;
    $scope.onShowSelected = onShowSelected;

    hotkeys
      .bindTo($scope)
      .add({
        combo: 'ctrl+q',
        description: 'Quit',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          gotoShows();
        }
      });
  }
}());