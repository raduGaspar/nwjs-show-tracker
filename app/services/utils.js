(function() {
  'use strict';

  angular
    .app
    .factory('Utils', Utils);

  Utils.$inject = ['$q', 'ngNotify'];

  function Utils($q, ngNotify) {
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
      defaults: {
        weekdays: [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday',
          'Thursday', 'Friday', 'Saturday'
        ]
      },
      onError: function(err) {
        if(err) {
          console.log('err', err);
          ngNotify.set(err.message || 'Error Occured', {
            position: 'top',
            type: 'error',
            sticky: true,
            duration: 2000
          });
        }
      },
      cleanIds: function(arr) {
        function doClean(set) {
          if(set.length) {
            for(var i=0; i<set.length; i++) {
              doClean(set[i]);
            }
          } else {
            delete set._id;
          }
        }

        doClean(arr);

        return arr;
      }
    };
  }
}());
