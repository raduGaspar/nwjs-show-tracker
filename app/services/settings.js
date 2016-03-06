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
      settings = {},
      // insert default settings into DB
      seed = function() {
        return DB.insert(settingsDb, { settings: defaults }).then(function(res) {
          console.log('SettingsServ inserted', res.settings);
          apply(res.settings);
        }, Utils.onError);
      },
      // apply loaded settings
      apply = function(res) {
        for(var i in res) {
          settings[i] = res[i];
        }
      },
      // reset settings to default
      reset = function() {
        purge().then(seed, Utils.onError);
      },
      // delete all settings
      purge = function() {
        return DB.delete(settingsDb, {}, { multiple: true }).then(function(res) {
          console.log('SettingsServ deleted', res);
        }, Utils.onError);
      };

    // purge();

    DB.find(settingsDb, {}).then(function(res) {
      console.log('SettingsServ settings', res);
      res.length ? apply(res[0].settings) : seed();
    }, Utils.onError);

    return {
      get: function() {
        return settings;
      },
      reset: reset
    };
  }
}());
