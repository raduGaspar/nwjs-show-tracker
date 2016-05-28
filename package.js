var NwBuilder = require('nw-builder'),
  pjson = require('./package.json'),
  fs = require('fs'),
  archiver = require('archiver'),
  opts = {
    files: './dist/**', // use the glob format
    version: '0.12.0',
    buildDir: 'c:/builds/build/',
    cacheDir: 'c:/builds/cache/',
    platforms: ['win64', 'osx64', 'linux64']
  },
  nw = new NwBuilder(opts);

// log build details
nw.on('log', console.log);

// start build
nw.build().then(function() {
  for(var i=0; i<opts.platforms.length; i++) {
    (function(platform) {
      var zipName = pjson.name + '-v' + pjson.version + '-' + platform + '.zip';
      var dest = opts.buildDir + pjson.name + '/';
      var source = dest + platform + '/';
      var output = fs.createWriteStream(dest+zipName);
      var archive = archiver('zip');
      console.log('Zipping', source);

      output.on('close', function () {
        console.log('Generated', dest+zipName);
      });

      archive.on('error', function(err){
        throw err;
      });

      archive.pipe(output);
      archive.bulk([
        { expand: true, cwd: source, src: ['**/*'], dest: pjson.name }
      ]);
      archive.finalize();
    }(opts.platforms[i]));
  }
}).catch(function(error) {
  console.error(error);
});