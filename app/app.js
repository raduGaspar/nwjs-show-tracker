(function() {
  'use strict';

  var pjson = require('./package.json');

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

  // append app version number to the title
  document.title += ' v' + pjson.version;
}());
