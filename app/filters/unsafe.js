(function() {
  'use strict';

  angular
    .app
    .filter('unsafe', unsafe);

  unsafe.$inject = ['$sce'];

  function unsafe($sce) {
    return $sce.trustAsHtml;
  }
}());
