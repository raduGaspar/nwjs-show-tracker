(function() {
  'use strict';

  angular
    .app
    .controller('AddShowCtrl', AddShowCtrl);

  AddShowCtrl.$inject = ['$scope', '$state', 'hotkeys', 'Utils', 'DB', 'ShowsServ'];

  function AddShowCtrl($scope, $state, hotkeys, Utils, DB, ShowsServ) {
    console.log('Hello from AddShowCtrl!');

    hotkeys
      .bindTo($scope)
      .add({
        combo: 'ctrl+q',
        description: 'Quit',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          gotoShows();
        }
      })

    var globals = Utils.getGlobals(),
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
        gotoShows();
      };

    if(editingShow) {
      var seasons = editingShow.seasons.length;
      editingShow.season = seasons;
      editingShow.episode = editingShow.seasons[seasons-1].ep;
    }

    $scope.editingShow = editingShow;
    $scope.showData = editingShow || {
      name: undefined,
      airsOn: new Date().getDay(),
      season: 1,
      episode: 1
    };
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
      data.seasons[startSeason-1].ep = parseInt(data.episode);

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
  }
}());