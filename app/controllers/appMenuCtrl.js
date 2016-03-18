(function() {
  'use strict';

  angular
    .app
    .controller('AppMenuCtrl', AppMenuCtrl);

  AppMenuCtrl.$inject = ['$scope', '$state'];

  function AppMenuCtrl($scope, $state) {
    console.log('Hello from AppMenuCtrl!');

    $scope.links = ['main.list', 'main.settings'];
  }
}());