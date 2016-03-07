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
      loadFile: function(path) {
        return $q(function(resolve, reject) {
          fs.readFile(path, 'utf8', function(err, data) {
            if(err) { reject(err); }
            resolve(data);
          });
        });
      },
      store: function(key, val) {
        if(key && val) {
          return localStorage.setItem(key, angular.toJson(val));
        } else if(key) {
          return angular.fromJson(localStorage.getItem(key));
        } else {
          console.log('a key must be specified');
        }
      },
      findById: function(set, id) {
        if(!set.length) { return null; }
        var len = set.length,
            i = 0;

        for(i; i<len; i++) {
          if(set[i]._id === id) {
            return set[i];
          }
        }

        return null;
      }
    };
  }
}());
