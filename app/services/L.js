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

      return obj;
    }

    function translate(key, args) {
      return dotSelector(i18n, key, args);
    }

    return {
      promise: promise,
      translate: translate,
      loadLocale: loadLocale
    };
  };
}());