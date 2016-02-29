(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$document', 'Utils'];

  function MainCtrl($scope, $document, Utils) {
    console.log('Hello from MainCtrl!');

    var developMode,
      globals = Utils.getGlobals();

    // keyboard events
    $document.bind('keydown', function(e) {
      $scope.pressedKey = e.which;
      $scope.$apply();
    });
    $document.bind('keyup', function(e) {
      $scope.pressedKey = null;
      $scope.$apply();
    });

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      globals.win.showDevTools();
    }
  }
}());
