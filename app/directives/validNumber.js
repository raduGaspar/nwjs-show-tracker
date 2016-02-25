(function() {
  'use strict';

  angular
    .app
    .directive('validNumber', validNumber);

  function validNumber() {
    return {
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        if(!ngModelCtrl) { return; }

        ngModelCtrl.$parsers.push(function(val) {
          var clean = val.replace(/[^0-9\.]/g, '');

          if (val !== clean) {
            ngModelCtrl.$setViewValue(clean);
            ngModelCtrl.$render();
          }

          return clean;
        });
      }
    };
  }
}());