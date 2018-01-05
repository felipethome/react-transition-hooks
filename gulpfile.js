/*eslint-disable no-console */

const browserify = require('browserify');
const connect = require('gulp-connect');
const merge = require('merge-stream');
const notify = require('gulp-notify');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const files = {
  dependencies: [
    'react',
    'react-dom',
    'react-addons-transition-group',
    'react-addons-css-transition-group',
  ],

  browserify: [
    './demo/main.js',
  ],
};

const browserifyTask = function (options) {
  let bundler = browserify({
    entries: [options.src],
    transform: [
      ['babelify', {
        presets: ['es2015', 'stage-2', 'react'],
        plugins: ['transform-class-properties'],
      }],
    ],
    debug: options.development,
    cache: {}, // Requirement of watchify
    packageCache: {}, // Requirement of watchify
    fullPaths: options.development,
    alias: ['/node_modules/react/react.js:react'],
    extensions: ['.js', '.jsx', '.json'],
  });

  const rebundle = function () {
    const start = Date.now();
    console.log('Building APP bundle');
    return bundler
      .bundle()
      .on('error', gutil.log)
      .pipe(source(options.output))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, connect.reload()))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  bundler.external(files.dependencies);

  if (options.development) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }

  return rebundle();
};

const browserifyDepsTask = function (options) {
  const vendorsBundler = browserify({
    debug: options.development,
    require: files.dependencies,
  });

  const start = new Date();
  console.log('Building VENDORS bundle');
  return vendorsBundler
    .bundle()
    .on('error', gutil.log)
    .pipe(source(options.output))
    .pipe(gulpif(!options.development, streamify(uglify())))
    .on('error', gutil.log)
    .pipe(gulp.dest(options.dest))
    .pipe(notify(function () {
      console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
    }));

};

gulp.task('demo', function() {
  process.env.NODE_ENV = 'development';

  const browserifyDepsOpt = {
    development: true,
    src: files.dependencies,
    output: 'vendors.js',
    dest: './demo/build/scripts',
  };

  const browserifyOpt = {
    development: true,
    src: files.browserify,
    output: 'bundle.js',
    dest: './demo/build/scripts',
  };

  const serverOpt = {
    root: './demo',
    port: 8080,
    livereload: true,
  };

  connect.server(serverOpt);

  return merge(
    browserifyDepsTask(browserifyDepsOpt),
    browserifyTask(browserifyOpt)
  );
});