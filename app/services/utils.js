(function() {
  'use strict';

  angular
    .app
    .factory('Utils', Utils);

  function Utils() {

    return {
      mega: function() {
        return 'wtf';
      }
    };
  }
}());
