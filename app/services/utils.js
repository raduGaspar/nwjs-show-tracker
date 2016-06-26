(function() {
  'use strict';

  angular
    .app
    .factory('Utils', Utils);

  Utils.$inject = ['$q', 'ngNotify'];

  function Utils($q, ngNotify) {
    var gui = require('nw.gui'),
      fs = require('fs'),
      path = require('path'),
      dirname = path.dirname(),
      win = gui.Window.get(),
      urls = {
        omdbapi: 'http://www.omdbapi.com/'
      },
      request = require('request'),
      zlib = require('zlib'),
      doGet = function(url) {
        return new Promise(function(resolve, reject) {
          request(url, { encoding: null }, function(err, response, body) {
            if(err) {
              reject(err);
            }

            if(response.headers['content-encoding'] === 'gzip') {
              zlib.gunzip(body, function(err, dezipped) {
                resolve(dezipped.toString());
              });
            } else {
              resolve(body);
            }
          });
        });
      };

    return {
      req: {
        doGet: doGet
      },
      getGlobals: function() {
        return {
          gui: gui,
          fs: fs,
          path: path,
          dirname: dirname,
          win: win,
          urls: urls
        };
      },
      onSuccess: function(data) {
        if(data) {
          console.log('Utils.onSuccess', data);
          ngNotify.set(data.message || 'Action was successfull!', {
            position: 'top',
            type: 'success',
            duration: 2000
          });
        }
      },
      onError: function(err) {
        if(err) {
          console.log('Utils.onError', err);
          var message;
          if(err.message) {
            message = err.message;
          } else if(err.config) {
            message = 'Error Occured on ' + err.config.method + ': ' + err.config.url;
          } else {
            message = 'Unknown Error Occured :(';
          }

          ngNotify.set(message, {
            position: 'top',
            type: 'error',
            sticky: true,
            duration: 2000
          });
        }
      },
      writeFile: function(path, data) {
        return $q(function(resolve, reject) {
          fs.writeFile(path, data, function(err) {
            if (err) { reject(err); }
            resolve(path);
          });
        });
      },
      readFile: function(path) {
        return $q(function(resolve, reject) {
          fs.readFile(path, 'utf8', function(err, data) {
            if(err) { reject(err); }
            resolve(data);
          });
        });
      },
      readDir: function(path) {
        return $q(function(resolve, reject) {
          fs.readdir(path, function(err, files) {
            if(err) { reject(err); }
            resolve(files);
          });
        });
      },
      emptyObject: function(obj) {
        for (var i in obj) {
          delete obj[i];
        }
      },
      cleanIds: function(arr) {
        function doClean(set) {
          if(set.length) {
            for(var i=0; i<set.length; i++) {
              doClean(set[i]);
            }
          } else {
            delete set._id;
          }
        }

        doClean(arr);

        return arr;
      },
      isUnique: function(set, key, value) {
        for(var i=0; i<set.length; i++) {
          if(set[i][key] === value) {
            return false;
          }
        }

        return true;
      },
      formatBytes: function(bytes, decimals) {
        bytes = parseInt(bytes, 10);

        if(bytes == 0) return '0 Byte';
        var k = 1024;
        var dm = decimals || 2;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      parseXMLString: function(str, nodeSelector) {
        if(!str || !nodeSelector) return;

        var result = {},
        parser = new DOMParser(),
        xmlDom = parser.parseFromString(str, 'text/xml'),
        items = xmlDom.querySelectorAll(nodeSelector),
        proc = function(arr, parent) {
          for(var i=0; i<arr.length; i++) {
            // pluralize name
            var nname = arr[i].nodeName + 's';

            if(arr[i].children.length > 1) {
              var obj = {};
              parent[nname] = parent[nname] || [];
              parent[nname].push(obj);
              proc(arr[i].children, obj);
            } else {
              var comboName = arr[i].nodeName.split(':'),
                node = comboName[0],
                leaf = comboName[1],
                entryHtml = arr[i].innerHTML || arr[i].outerHTML;

              // strip cdata
              entryHtml = entryHtml
                .replace('<![CDATA[', '')
                .replace(']]>', '');

              if(comboName.length > 1) {
                parent[node] = parent[node] || {};
                parent[node][leaf] = decodeURIComponent(entryHtml);
              } else {
                parent[arr[i].nodeName] = parent[arr[i].nodeName] || {};
                parent[arr[i].nodeName] = decodeURIComponent(entryHtml);
              }
            }
          }
        };

        proc(items, result);

        return result;
      }
    };
  }
}());
