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
      doDelete = function(db, data, opts) {
        opts = opts || {};

        return $q(function(resolve, reject) {
          if(!db || !data) {
            reject({ message: 'required parameters missing' });
          } else {
            // remove all temporary values
            if(data['_temp']) {
              delete data['_temp'];
            }
            db.remove(data, opts, function(err, numRemoved) {
              if(err) { reject(err); }

              resolve(numRemoved);
            });
          }
        });
      },
      doFind = function(db, data) {
        return $q(function(resolve, reject) {
          if(!db || !data) {
            reject({ message: 'required parameters missing' });
          } else {
            // remove all temporary values
            if(data['_temp']) {
              delete data['_temp'];
            }
            db.find(data, function(err, docs) {
              if(err) { reject(err); }

              resolve(docs);
            });
          }
        });
      },
      doUpdate = function(db, query, update, opts) {
        opts = opts || {};

        return $q(function(resolve, reject) {
          if(!db || !query || !update) {
            reject({ message: 'required parameters missing' });
          } else {
            // remove all temporary values
            if(update['_temp']) {
              delete update['_temp'];
            }
            db.update(query, update, opts, function(err, numReplaced) {
              console.log('updated record', arguments);
              if(err) { reject(err); }

              resolve(numReplaced);
            });
          }
        });
      },
      doInsert = function(db, data) {
        return $q(function(resolve, reject) {
          if(!db || !data) {
            reject({ message: 'required parameters missing' });
          } else {
            if(data['_temp']) {
              delete data['_temp'];
            }
            db.insert(data, function(err, newDocs) {
              if(err) { reject(err); }

              resolve(newDocs);
            });
          }
        });
      },
      doImport = function(data) {
        console.log('DB import', data);
        var all = [];
        for(var i=0; i<dbs.length; i++) {
          all.push(
            doDelete(db[dbs[i]], {}, { multi: true }),
            doInsert(db[dbs[i]], data[i])
          );
        }
        return $q.all(all);
      },
      doExport = function() {
        console.log('DB export');
        var all = [];
        for(var i=0; i<dbs.length; i++) {
          all.push(doFind(db[dbs[i]], {}));
        }
        return $q.all(all);
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
      import: doImport,
      export: doExport
    };
  }
}());