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
        controller: 'OmdbCtrl',
        templateUrl: './app/partials/ngOmdb.html'
      };
    });
}());
