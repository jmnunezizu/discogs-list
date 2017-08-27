var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');

const mam = require('mock-api-middleware');

const mockApi = mam('/api', {
  mockPath: './mocks/'
})

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map',
    ])
    .pipe(gulp.dest('vendor/bootstrap'));

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'));

  gulp.src(['node_modules/popper.js/dist/umd/popper.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest('vendor/popper'));

  gulp.src([
    'node_modules/font-awesome/**/*', 
    '!node_modules/font-awesome/less/**/*',
    '!node_modules/font-awesome/scss/**/*'
  ])
  .pipe(gulp.dest('vendor/font-awesome'));
})

// Default task
gulp.task('default', ['copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
    middleware: [
      mockApi
    ]
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync'], function() {
  // Reloads the browser whenever HTML or CSS files change
  gulp.watch('css/*.css', browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
});
