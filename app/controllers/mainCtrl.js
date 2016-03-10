(function() {
  'use strict';

  angular
    .app
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$document', 'L', 'Utils', 'SettingsServ'];

  function MainCtrl($scope, $document, L, Utils, SettingsServ) {
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
    $scope.L = L.translate;
    $scope.$watch('settings', function(newVal, oldVal) {
      console.log('settings changed', newVal);
      if(newVal) {
        SettingsServ.save();
      }
    }, true);

    // all console.log calls are removed when packaging; cool huh? :D
    console.log(developMode = true);

    if(developMode) {
      globals.win.showDevTools();
    }
  }
}());
