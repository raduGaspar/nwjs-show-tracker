(function() {
  'use strict';

  angular
    .app
    .controller('AppMenuCtrl', AppMenuCtrl);

  AppMenuCtrl.$inject = ['$scope', '$state', 'Utils'];

  function AppMenuCtrl($scope, $state, Utils) {
    console.log('Hello from AppMenuCtrl!');

    // TODO: add logic for menu translation
    var globals = Utils.getGlobals(),
      gui = globals.gui,
      win = globals.win,
      menu = [
        {
          label: 'Shows',
          click: function() { onClick.call(this, 'shows.list'); }
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
      onClick = function(state) {
        var toState = state || this.label.split(' ')[0].toLowerCase();
        console.log('clicked', this.label, $state.current.name, toState);
        if($state.current.name !== toState) {
          $state.go(toState);
          $scope.$apply();
        }
      },
      initMenu = function() {
        var appMenu = new gui.Menu({ 'type': 'menubar' }),
          createEntry = function(node, submenu) {
            var entry = { label: node.label, click: (node.click || onClick) };
            if(submenu) { entry.submenu = submenu; }

            return new gui.MenuItem(entry);
          },
          traverse = function(node, parent) {
            var i = 0,
              nodeLen = node.length;
            for(i; i<nodeLen; i++) {
              if(parent) {
                parent.append(createEntry(node[i]));
              } else {
                if(node[i].submenu) {
                  var options = new gui.Menu();
                  appMenu.append(createEntry(node[i], options));
                  traverse(node[i].submenu, options);
                } else {
                  appMenu.append(createEntry(node[i]));
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