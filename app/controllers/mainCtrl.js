(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$document', 'Utils', 'SettingsServ'];

  function MainCtrl($scope, $document, Utils, SettingsServ) {
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

    $scope.settings = SettingsServ.get();
    $scope.$watch('settings', function(newVal, oldVal) {
      console.log('settings changed', newVal);
    }, true);

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      globals.win.showDevTools();
    }
  }
}());
