// Build "NGN Chassis Showroom"
'use strict'

// Dependencies ----------------------------------------------------------------
var gulp = require('gulp')
var sass = require('gulp-sass')
var del = require('del')
var path = require('path')
var pkg = require('./package.json')
var fs = require('fs')
var wrench = require('wrench')
var header = require('gulp-header')
var headerComment = '/**\n  * v' + pkg.version + ' generated on: ' + (new Date()) + '\n  * Copyright (c) 2014-' + (new Date()).getFullYear() + ', Ecor Ventures LLC. All Rights Reserved.\n  */\n'

// Sass Paths ------------------------------------------------------------------
var SOURCE = path.resolve('./src')

var SHOWROOM = {
  SASS: path.resolve('./showroom/sass/**/*.s*ss'),
  INCLUDE: SOURCE
}

var DEST = './showroom'
var DIST = path.resolve('./dist')

// Sass ------------------------------------------------------------------------
gulp.task('sasscompile', function () {
  return gulp.src([SHOWROOM.SASS])
    .pipe(
      sass({
        includePaths: require('./index').includePaths.concat(SHOWROOM.INCLUDE)
      })
    ).on('error', sass.logError)
    .pipe(gulp.dest(DEST + '/stylesheets'))
})

// Cleanup ---------------------------------------------------------------------
gulp.task('clean', function (next) {
  fs.exists(DEST + '/stylesheets', function (exists) {
    exists && del.sync(DEST + '/stylesheets')
    next()
  })
})

// Check versions for Bower & npm
// gulp.task('version', function (next) {
//   console.log('Checking versions.')
//
//   // Sync Bower
//   var bower = require('./bower.json')
//   if (bower.version !== pkg.version) {
//     console.log('Updating bower package.')
//     bower.version = pkg.version
//     fs.writeFileSync(path.resolve('./bower.json'), JSON.stringify(bower, null, 2))
//   }
// })

gulp.task('make', function () {
  // Recreate dist directory
  if (fs.existsSync(DIST)) {
    del.sync(DIST)
  }
  // fs.mkdirSync(DIST)

  wrench.copyDirSyncRecursive(SOURCE, DIST, {
    forceDelete: true, // Whether to overwrite existing directory or not
    excludeHiddenUnix: false, // Whether to copy hidden Unix files or not (preceding .)
    preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
    preserveTimestamps: true, // Preserve the mtime and atime when copying files
    inflateSymlinks: true // Whether to follow symlinks or not when copying files
  })
})

// Build -----------------------------------------------------------------------
gulp.task('build', ['clean', 'sasscompile'])

// Watch -----------------------------------------------------------------------
gulp.task('watch', function () {
  gulp.watch(SHOWROOM.SASS, ['clean', 'sasscompile'])
})

// Dev -------------------------------------------------------------------------
gulp.task('dev', ['build', 'watch'])
