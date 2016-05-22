(function() {
  'use strict';

  angular
    .app
    .directive('ngAutoFocus', autoFocus);

  autoFocus.$inject = ['$timeout'];

  function autoFocus($timeout) {
    return {
      restrict: 'A',
      link: function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
        }, 0);
      }
    };
  }
}());
