(function() {
  'use strict';

  angular
    .app
    .directive('ngOmdb', function() {
      return {
        scope: {
          icon: '@',
          placeholder: '@',
          title: '@',
          noMatches: '@',
          model: '@',
          movies: '=',
          onSelect: '='
        },
        replace: true,
        templateUrl: './app/partials/ngOmdb.html',
        compile: function(element, attrs) {
          attrs.placeholder = attrs.placeholder || '';
        }
      }
    });
}());
