(function() {
  'use strict';

  angular
    .app
    .controller('AppMenuCtrl', AppMenuCtrl);

  AppMenuCtrl.$inject = ['$scope', '$state'];

  function AppMenuCtrl($scope, $state) {
    console.log('Hello from AppMenuCtrl!');

    var gui = require('nw.gui'),
      win = gui.Window.get(),
      menu = [
        {
          label: 'Shows'
        },
        {
          label: 'Settings'
        },
        {
          label: 'Help',
          submenu: [
            { label: 'Shortcuts' },
            { label: 'About' }
          ]
        }
      ],
      onClick = function() {
        console.log('clicked', this.label, $state.current.name);
        var toState = this.label.split(' ')[0].toLowerCase();
        if($state.current.name !== toState) {
          $state.go(toState);
          $scope.$apply();
        }
      },
      initMenu = function() {
        var appMenu = new gui.Menu({ 'type': 'menubar' }),
          createEntry = function(label, submenu) {
            var entry = { label: label, click: onClick };
            if(submenu) { entry.submenu = submenu; }

            return new gui.MenuItem(entry);
          },
          traverse = function(node, parent) {
            var i = 0,
              nodeLen = node.length;
            for(i; i<nodeLen; i++) {
              if(parent) {
                parent.append(createEntry(node[i].label));
              } else {
                if(node[i].submenu) {
                  var options = new gui.Menu();
                  appMenu.append(createEntry(node[i].label, options));
                  traverse(node[i].submenu, options);
                } else {
                  appMenu.append(createEntry(node[i].label));
                }
              }
            }
          };

        traverse(menu);

        win.menu = appMenu;
      };

    // init menu
    initMenu();
  }
}());