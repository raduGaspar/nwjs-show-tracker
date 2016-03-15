(function() {
  'use strict';

  angular
    .app
    .factory('L', L);

  L.$inject = ['Utils', 'SettingsServ'];

  function L(Utils, SettingsServ) {
    var i18n, promise, languages = {},
      globals = Utils.getGlobals(),
      dirname = globals.dirname,
      loadLocale = function(locale) {
        console.log('changing language to', locale);
        locale = locale || 'en.json';

        return Utils.readFile(dirname + '/i18n/' + locale)
          .then(function(res) {
            i18n = angular.fromJson(res);
            console.log('lang', i18n);
          });
      };

    // search for available language files
    promise = Utils.readDir(dirname + '/i18n')
      .then(function(files) {
        console.log('files', files);
        languages.available = files;

        return SettingsServ.promise;
      }, Utils.onError)
      .then(function() {
        return loadLocale(SettingsServ.get().language);
      });

    function dotSelector(obj, str, args) {
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

      // replace dynamic variables which point to objects inside the file
      if(typeof obj === 'string') {
        var localVars = obj.match(/\${this.(.*?)}/g) || [];
        if(localVars.length) {
          for(var lv=0; lv<localVars.length; lv++) {
            var short = localVars[lv]
              .replace('${this.', '')
              .replace('}', ''),
              reg = new RegExp('\\'+localVars[lv], 'g');

            obj = obj.replace(reg, dotSelector(i18n, short) || '');
          }
        }

        // replace dynamic variables with provided values
        if(args) {
          var k, reg;
          for(k in args) {
            reg = new RegExp('\\${'+k+'}', 'g');
            obj = obj.replace(reg, args[k]);
          }
        }
      }

      return obj;
    }

    function translate(key, args) {
      return dotSelector(i18n, key, args);
    }

    return {
      promise: promise,
      languages: languages,
      translate: translate,
      loadLocale: loadLocale
    };
  };
}());