(function() {
  'use strict';

  angular
    .app
    .controller('OmdbCtrl', OmdbCtrl);

  OmdbCtrl.$inject = ['$scope', '$http', 'Utils'];

  function OmdbCtrl($scope, $http, Utils) {
    console.log('Hello from OmdbCtrl!');
    var globals = Utils.getGlobals(),
      urls = globals.urls;

    $scope.movieSelected = function(item) {
      console.log('movie selected', item);

      if($scope.onSelect) {
        $scope.onSelect(item);
      }
    };

    $scope.getMovies = function(val) {
      return $http.get(urls.omdbapi, {
        params: {
          s: val
        }
      }).then(function(res) {
        return res.data.Search;
      }, Utils.onError);
    };
  }
}());