(function() {
  'use strict';

  angular
    .app
    .factory('ShowsServ', ShowsServ);

  // ShowsServ.$inject = [];

  function ShowsServ() {
    console.log('Hello from ShowsServ!');
    var selected = {};

    return {
      setSelected: function(show) {
        selected.current = show;
      },
      getSelected: function() {
        return selected.current;
      }
    };
  }
}());
