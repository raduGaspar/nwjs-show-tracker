(function() {
  'use strict';

  angular
    .app
    .controller('AppMenuCtrl', AppMenuCtrl);

  AppMenuCtrl.$inject = ['$scope'];

  function AppMenuCtrl($scope) {
    console.log('Hello from AppMenuCtrl!');

    var gui = require('nw.gui'),
      win = gui.Window.get(),
      menu = [
        {
          label: 'Shows',
          submenu: [
            { label: 'Add' },
            { label: 'Manage' }
          ]
        },
        {
          label: 'Tags',
          submenu: [
            { label: 'Add' },
            { label: 'Manage' }
          ]
        },
        {
          label: 'Settings'
        }
      ],
      onClick = function() {
        console.log('clicked', this.label);
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