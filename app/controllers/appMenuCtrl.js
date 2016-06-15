(function() {
  'use strict';

  angular
    .app
    .controller('AppMenuCtrl', AppMenuCtrl);

  AppMenuCtrl.$inject = ['$scope'];

  function AppMenuCtrl($scope) {
    console.log('Hello from AppMenuCtrl!');

    $scope.links = ['main.episodes', 'main.list', 'main.settings'];

    $scope.$watch('activeMenu', function(newVal, oldVal) {
      $scope.current = newVal.current;
    }, true);
  }
}());