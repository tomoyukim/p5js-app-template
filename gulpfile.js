'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync =require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var notifier = require('node-notifier');
var runSequence = require('run-sequence');

var config = {
    server : {
        port: 8080
    },
    js: {
        output: {
            filename: 'app.min.js',
            directory: './dist/js'
        },
        entry: './app/js/app.js',
        files: [
            './app/js/*.js'
        ]
    },
    copy: {
        output: {
            directory: './dist'
        },
        files: [
            './app/index.html',
            './app/assets/*'
        ]
    }
};

var notify = function(taskName, error) {
  var title = '[task]' + taskName + ' ' + error.plugin;
  var errorMsg = 'error: ' + error.message;
  console.error(title + '\n' + errorMsg);
  notifier.notify({
    title: title,
    message: errorMsg,
    time: 3000
  });
};

gulp.task('server', function() {
  browserSync({
    port: config.server.port,
    server: {
      baseDir: './dist/',
      index  : 'index.html'
    }
  });
});

gulp.task('reloadServer', function () {
  browserSync.reload();
});

gulp.task('copy', function() {
    return gulp.src(config.copy.files, { base:'./app' })
        .pipe(gulp.dest(config.copy.output.directory));
});

gulp.task('clean', function() {
    return del(['./dist/**/*']);
});

function bundler() {
    return browserify(config.js.entry).transform('babelify', {presets: ["es2015"]});
}

gulp.task('js', ['lint'], function() {
    return bundler().bundle()
        .pipe($.plumber({
            errorHandler: function(error) {
                notify('js', error);
            }
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.rename(config.js.output.filename))
        .pipe($.sourcemaps.init({loadMaps:true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe($.plumber.stop())
        .pipe(gulp.dest(config.js.output.directory));
});

gulp.task('js-prod', ['lint'], function() {
    return bundler().bundle()
        .pipe($.plumber({
            errorHandler: function(error) {
                notify('js', error);
            }
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.rename(config.js.output.filename))
        .pipe($.uglify())
        .pipe($.plumber.stop())
        .pipe(gulp.dest(config.js.output.directory));
});

gulp.task('lint', function() {
  return gulp.src(config.js.files)
    .pipe($.plumber({
      errorHandler: function(error) {
        notify('lint', error);
      }
    }))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
    .pipe($.plumber.stop());
});


gulp.task('build', ['clean', 'js', 'copy'], function() {
});

gulp.task('watch', function() {
  gulp.watch(config.js.files, function() {
    runSequence('js', 'reloadServer');
  });
});

gulp.task('default', ['build', 'watch', 'server']);
gulp.task('release', ['clean', 'js-prod', 'copy']);
