(function() {
  'use strict';

  angular
    .app
    .factory('Utils', Utils);

  Utils.$inject = ['$q'];

  function Utils($q) {
    var gui = require('nw.gui'),
      fs = require('fs'),
      path = require('path'),
      dirname = path.dirname(),
      win = gui.Window.get();

    return {
      getGlobals: function() {
        return {
          gui: gui,
          fs: fs,
          path: path,
          dirname: dirname,
          win: win
        }
      },
      loadFile: function(path) {
        return $q(function(resolve, reject) {
          fs.readFile(path, 'utf8', function(err, data) {
            if(err) { reject(err); }
            resolve(data);
          });
        });
      }
    };
  }
}());
