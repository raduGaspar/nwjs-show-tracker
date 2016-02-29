(function() {
  'use strict';

  angular
    .app
    .controller('AddShowCtrl', AddShowCtrl);

  AddShowCtrl.$inject = ['$scope', '$state', 'Utils', 'DB'];

  function AddShowCtrl($scope, $state, Utils, DB) {
    console.log('Hello from AddShowCtrl!');
    var globals = Utils.getGlobals(),
      db = DB.getDb('shows'),
      scopeUpdate = function() {
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      },
      gotoShows = function() {
        $state.go('shows.list');
        scopeUpdate();
      };

    $scope.days = Utils.defaults.weekdays;
    $scope.showData = {
      name: undefined,
      airsOn: Utils.defaults.weekdays[new Date().getDay()],
      season: 1,
      episode: 1
    };
    $scope.doSave = function(model) {
      if(!model.name) { return; }

      console.log('save show', model);
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

      DB.insert(db, data).then(function(newShow) {
        console.log('new show added', newShow);
        gotoShows();
      }, Utils.onError);
    };
    $scope.doCancel = function() {
      console.log('cancel save');
      gotoShows();
    };
  }
}());