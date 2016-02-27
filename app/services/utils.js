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
      win = gui.Window.get(),
      Datastore = require('nedb'),
      db = {};

    db.settings = new Datastore({
      autoload: true,
      filename: path.join(gui.App.dataPath, 'settings.db')
    });

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
      },
      getDb: function(name) {
        return db[name] ? db[name] : db;
      }
    };
  }
}());
