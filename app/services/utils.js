(function() {
  'use strict';

  angular
    .app
    .factory('Utils', Utils);

  function Utils() {
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
      }
    };
  }
}());
