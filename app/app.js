(function() {
  'use strict';

  angular.app = angular
    .module('showtracker', [
      'ui.router',
      'ngAnimate',
      'ngTagsInput',
      'ngNotify',
      'cfp.hotkeys'
    ])
    .config(['hotkeysProvider', function(hotkeysProvider) {
      hotkeysProvider.useNgRoute = false;
    }]);
}());
