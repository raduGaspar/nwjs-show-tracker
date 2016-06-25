(function() {
  'use strict';

  angular
    .app
    .controller('EpisodesCtrl', EpisodesCtrl);

  EpisodesCtrl.$inject = [
    '$scope', 'Utils'
  ];

  function EpisodesCtrl($scope, Utils) {
    console.log('Hello from EpisodesCtrl!');

    // var url = 'rss/feed/url/here';
    // Utils.req.doGet(url).then(function(res) {
    //   var xml = Utils.parseXMLString(res, 'item');
    //   $scope.items = xml.items;
    // });
  }
}());