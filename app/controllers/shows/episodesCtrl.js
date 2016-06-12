(function() {
  'use strict';

  angular
    .app
    .controller('EpisodesCtrl', EpisodesCtrl);

  EpisodesCtrl.$inject = [
    '$scope'
  ];

  function EpisodesCtrl($scope) {
    console.log('Hello from EpisodesCtrl!');
  }
}());