(function() {
  'use strict';

  angular
    .app
    .factory('L', L);

  L.$inject = ['Utils'];

  function L(Utils) {
    // TODO: refactor this to read the i18n folder for lang files
    var i18n, promise,
      globals = Utils.getGlobals(),
      dirname = globals.dirname,
      loadLocale = function(locale) {
        locale = locale || 'en.json';

        promise = Utils.readFile(dirname + '/i18n/' + locale)
          .then(function(res) {
            i18n = angular.fromJson(res);
            console.log('lang', i18n);
          });
      };

    // search for available language files
    Utils.readDir(dirname + '/i18n').then(function(files) {
      loadLocale();
    }, Utils.onError);

    function dotSelector(obj, str) {
      var path = str.split('.'),
        pathLen = path.length,
        i = 0,
        key;
      for (i; i<pathLen; i++) {
        key = path[i];
        if (obj && key in obj) {
          obj = obj[key];
        } else {
          return;
        }
      }
      return obj;
    }

    function translate(key, args) {
      return dotSelector(i18n, key);
    }

    return {
      promise: promise,
      translate: translate,
      loadLocale: loadLocale
    };
  };
}());