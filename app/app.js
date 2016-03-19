(function() {
  'use strict';

  angular.app = angular
    .module('showtracker', [
      'ui.bootstrap',
      'ui.router',
      'ngAnimate',
      'ngTagsInput',
      'ngNotify',
      'cfp.hotkeys'
    ])
    .config(['hotkeysProvider', function(hotkeysProvider) {
      hotkeysProvider.useNgRoute = false;
      console.log(hotkeysProvider);
    }]);
}());
