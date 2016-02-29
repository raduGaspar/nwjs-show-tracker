(function() {
  'use strict';

  angular
    .app
    .controller('AddShowCtrl', AddShowCtrl);

  AddShowCtrl.$inject = ['$scope', '$state', 'Utils'];

  function AddShowCtrl($scope, $state, Utils) {
    console.log('Hello from AddShowCtrl!');
    var scopeUpdate = function() {
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
      console.log('save show', model);
      gotoShows();
    };
    $scope.doCancel = function() {
      console.log('cancel save');
      gotoShows();
    };
  }
}());