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
      win = gui.Window.get(),
      urls = {
        omdbapi: 'http://www.omdbapi.com/'
      };

    return {
      getGlobals: function() {
        return {
          gui: gui,
          fs: fs,
          path: path,
          dirname: dirname,
          win: win,
          urls: urls
        };
      },
      onSuccess: function(data) {
        if(data) {
          console.log('Utils.onSuccess', data);
          ngNotify.set(data.message || 'Action was successfull!', {
            position: 'top',
            type: 'success',
            duration: 2000
          });
        }
      },
      onError: function(err) {
        if(err) {
          console.log('Utils.onError', err);
          var message;
          if(err.message) {
            message = err.message;
          } else if(err.config) {
            message = 'Error Occured on ' + err.config.method + ': ' + err.config.url;
          } else {
            message = 'Unknown Error Occured :(';
          }

          ngNotify.set(message, {
            position: 'top',
            type: 'error',
            sticky: true,
            duration: 2000
          });
        }
      },
      writeFile: function(path, data) {
        return $q(function(resolve, reject) {
          fs.writeFile(path, data, function(err) {
            if (err) { reject(err); }
            resolve(path);
          });
        });
      },
      readFile: function(path) {
        return $q(function(resolve, reject) {
          fs.readFile(path, 'utf8', function(err, data) {
            if(err) { reject(err); }
            resolve(data);
          });
        });
      },
      readDir: function(path) {
        return $q(function(resolve, reject) {
          fs.readdir(path, function(err, files) {
            if(err) { reject(err); }
            resolve(files);
          });
        });
      },
      emptyObject: function(obj) {
        for (var i in obj) {
          delete obj[i];
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
      },
      isUnique: function(set, key, value) {
        for(var i=0; i<set.length; i++) {
          if(set[i][key] === value) {
            return false;
          }
        }

        return true;
      }
    };
  }
}());
