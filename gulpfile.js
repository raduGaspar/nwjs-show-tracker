var

// Dependencies
gulp = require('gulp'),
jshint = require('gulp-jshint'),
compass = require('gulp-compass'),
concat = require('gulp-concat'),
minifyCss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
stripDebug = require('gulp-strip-debug'),
rename = require("gulp-rename"),
ngAnnotate = require('gulp-ng-annotate'),
domSrc = require('gulp-dom-src'),
cheerio = require('gulp-cheerio'),
p = require('./package.json'),

// File Paths
base = 'app/',
build = 'dist/',
css = 'assets/css/',
img = 'assets/img/',
fonts = 'assets/fonts/',
i18n = 'i18n/',
js = base + 'js/',
bower = 'libs/',
data = 'data/',
nodeDeps = 'node_modules/',

path = {
  outputNames: {
    css: 'rgb-show-tracker.min.css',
    js: 'rgb-show-tracker.min.js'
  },
  input: {
    js: base + '**/*.js',
    scss: 'sass/styles.scss',
    images: 'assets/img/',
    i18n: i18n,
    fonts: [
      bower + 'bootstrap/dist/fonts/*.*',
      bower + 'components-font-awesome/fonts/*.*'
    ],
    partials: base + 'partials/'
  },
  output: {
    fonts: build + fonts,
    i18n: build + i18n,
    nodeDeps: build + nodeDeps
  }
};

// Tasks:
// jsHint code verification
gulp.task('jshint', function() {
  gulp
    .src(path.input.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Compass task - compile SCSS into CSS
gulp.task('compass', function() {
  gulp.src(path.input.scss)
    .pipe(compass({
      config_file: './config.rb',
      css: css, // outputs it to 'assets/css/' css gulp task can merge it
      sass: 'sass'
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest(css));
});

/*
 * Read all CSS files from index.html
 * concat and minify them
 */
gulp.task('css', function() {
  var buildPath = build + css;

  return domSrc({file:'index.html', selector:'link', attribute:'href'})
    .pipe(concat(path.outputNames.css))
    .pipe(gulp.dest(buildPath))
    .pipe(minifyCss())
    .pipe(gulp.dest(buildPath));
});

/*
 * Read all JS files from index.html
 * concat and minify them
 */
gulp.task('js', function() {
  var buildPath = build + js;

  return domSrc({file:'index.html', selector:'script', attribute:'src'})
    .pipe(concat(path.outputNames.js))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(buildPath))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(buildPath));
});

/*
 * Generate distribution index.html
 * based on old HTML and new CSS and JS files
 */
gulp.task('indexHtml', function() {
  return gulp.src('index.html')
    .pipe(cheerio(function($) {
      $.fn.cleanWhitespace = function() {
        textNodes = this.contents().filter(
          function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
          .remove();
        return this;
      };

      var jsSrc = js + path.outputNames.js,
        cssSrc = css + path.outputNames.css;

      // remove all scripts files with source tags
      $('script[src]').remove();
      // remove all style tags
      $('link').remove();
      // create script and link tags for minified files
      $('body').prepend('<script src="'+jsSrc+'"></script>');
      $('head').append('<link rel="stylesheet" href="'+cssSrc+'">');
      // clean html of any whitespaces
      $('head').cleanWhitespace();
      $('body').cleanWhitespace();
    }))
    .pipe(gulp.dest(build));
});

// i18n copy task
gulp.task('i18n', function() {
  return gulp.src(path.input.i18n + '*.*')
    .pipe(gulp.dest(path.output.i18n));
});

// Fonts copy task
gulp.task('fonts', function() {
  return gulp.src(path.input.fonts)
    .pipe(gulp.dest(path.output.fonts));
});

// Node dependencies modules copy task
gulp.task('nodeDeps', function() {
  var res = [];
  for(var i in p.dependencies) {
    res.push(nodeDeps+i+'/**/*.*');
  }

  return gulp.src(res, { base: nodeDeps })
    .pipe(gulp.dest(path.output.nodeDeps));
});

// Image copy task
gulp.task('images', function() {
  return gulp.src(path.input.images + '/**/*.*')
    .pipe(gulp.dest(build + path.input.images));
});

// Partials copy task
gulp.task('partials', function() {
  return gulp.src(path.input.partials + '/**/*.*')
    .pipe(gulp.dest(build + path.input.partials));
});

// Copy package.json to dist
gulp.task('packageFile', function() {
  return gulp.src('package.json')
    .pipe(gulp.dest(build));
});

// Default task
gulp.task('default', [
  'css',
  'js',
  'indexHtml',
  'i18n',
  'fonts',
  'nodeDeps',
  // 'images',
  'partials',
  'packageFile'
]);