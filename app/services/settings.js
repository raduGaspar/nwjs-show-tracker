(function() {
  'use strict';

  angular
    .app
    .factory('SettingsServ', SettingsServ);

  SettingsServ.$inject = ['DB', 'Utils'];

  function SettingsServ(DB, Utils) {
    var settingsDb = DB.getDb('settings'),
      defaults = {
        language: 'en',
        showTags: true,
        trackers: {
          selected: 0,
          list: [
            { url: 'http://kat.cr/usearch/' },
            { url: 'http://filelist.ro/browse.php?search=' }
          ]
        }
      },
      sid = null,
      settings = {},
      // insert default settings into DB
      seed = function() {
        return DB.insert(settingsDb, { settings: defaults }).then(function(res) {
          console.log('SettingsServ inserted', res.settings);
          apply(res);
        }, Utils.onError);
      },
      // apply loaded settings
      apply = function(res) {
        console.log(res);
        sid = res._id;
        for(var i in res.settings) {
          settings[i] = res.settings[i];
        }
      },
      // reset settings to default
      reset = function() {
        purge().then(seed, Utils.onError);
      },
      // save current settings to DB
      save = function() {
        if(!sid) { return; }

        return DB.update(settingsDb, { _id: sid }, {
          settings: angular.copy(settings)
        }).then(function(res) {
          console.log('SettingsServ update success', res);
        }, Utils.onError);
      },
      // delete all settings
      purge = function() {
        return DB.delete(settingsDb, {}, { multi: true }).then(function(res) {
          console.log('SettingsServ deleted', res);
        }, Utils.onError);
      };

    // purge();

    var promise = DB.find(settingsDb, {}).then(function(res) {
      console.log('SettingsServ settings', res);
      res.length ? apply(res[0]) : seed();
    }, Utils.onError);

    return {
      promise: promise,
      get: function() {
        return settings;
      },
      save: save,
      reset: reset
    };
  }
}());
