(function() {
  'use strict';

  angular
    .app
    .factory('DB', DB);

  DB.$inject = ['$q', 'Utils'];

  function DB($q, Utils) {
    var globals = Utils.getGlobals(),
      path = globals.path,
      gui = globals.gui,
      Datastore = require('nedb'),
      db = {},
      dbs = ['settings', 'shows'],
      defaults = {
        trackers: [
          { url: 'http://kat.cr/usearch/' },
          { url: 'http://filelist.ro/browse.php?search=' }
        ]
      },
      doDelete = function(db, data, opts) {
        if(!db || !data) { return; }
        opts = opts || {};

        return $q(function(resolve, reject) {
          db.remove(data, opts, function(err, numRemoved) {
            if(err) { reject(err); }

            resolve(numRemoved);
          });
        });
      },
      doFind = function(db, data) {
        if(!db || !data) { return; }

        return $q(function(resolve, reject) {
          db.find({}, function(err, docs) {
            if(err) { reject(err); }

            resolve(docs);
          });
        });
      },
      doUpdate = function(db, query, update, opts) {
        if(!db || !query || !update) { return; }
        opts = opts || {};

        return $q(function(resolve, reject) {
          db.update(query, update, opts, function(err, numReplaced) {
            console.log('updated record', arguments);
            if(err) { reject(err); }

            resolve(numReplaced)
          });
        });
      },
      doInsert = function(db, data) {
        if(!db || !data) { return; }

        return $q(function(resolve, reject) {
          db.insert(data, function(err, newDocs) {
            if(err) { reject(err); }

            resolve(newDocs);
          });
        });
      },
      doReset = function(db) {
        if(!db) { return; }

        // don't use $q.all; no need for the nbr. of deleted records
        return doDelete(db, {}, { multi: true }).then(function() {
          return doInsert(db, defaults.trackers);
        });
      },
      init = function() {
        for(var i=0; i<dbs.length; i++) {
          var currentDb = dbs[i];
          if(!db[currentDb]) {
            db[currentDb] = new Datastore({
              autoload: true,
              filename: path.join(gui.App.dataPath, currentDb + '.db')
            });
          }
        }
      };

    init();

    return {
      getDb: function(name) {
        return db[name] ? db[name] : db;
      },
      find: doFind,
      insert: doInsert,
      update: doUpdate,
      delete: doDelete,
      reset: doReset
    };
  }
}());