/*global app:false */
'use strict';

angular
  .module('app')
  .factory('L', ['$locale', '$http',
    function($locale, $http) {
      var i18n, promise,
        locales = ['en', 'ro'],
        loadLocale = function(locale) {
          locale = locale || $locale.id;
          locale = locale.toLowerCase();

          var allowedLocale = locales.indexOf(locale) > -1,
            useLocale = allowedLocale ? locale : locales[0];

          promise = $http.get('i18n/language-' + useLocale + '.json')
            .then(function(res) {
              i18n = res.data;
            });
        };

      // load locale json
      if(!i18n) {
        loadLocale(locales[0]);
      } else {
        console.log('locale json already loaded');
      }

      function dotSelector(obj, str) {
        var path = str.split('.'),
          pathLen = path.length,
          i = 0,
          key;
        for (i; i < pathLen; i++) {
          var key = path[i];
          if (key in obj) {
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
    }
  ]);