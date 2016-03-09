(function() {
  'use strict';

  angular
    .app
    .directive('bindTo', function() {
      return function(scope, element, attrs) {
        element.bind('click', function(e) {
          angular.element(attrs.bindTo).trigger('click');
        });
      };
    });
}());
