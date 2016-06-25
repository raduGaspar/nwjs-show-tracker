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

    // var url = 'rss/url/here';
    // Utils.req.doGet(url).then(function(res) {
    //   console.log('parsedXML', Utils.parseXMLString(res, 'item'));
    // });
  }
}());