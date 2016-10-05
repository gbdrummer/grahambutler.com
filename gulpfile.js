// Build "Boilerplate"
'use strict'

const chalk = require('chalk')
const gulp = require('gulp')
const gutil = require('gulp-util')
const sass = require('gulp-sass')
const depalert = require('gulp-depalert')
const notify = require('gulp-notify')
const del = require('rimraf')
const path = require('path')
const fs = require('fs-extra')
const pkg = require('./package.json')
const ShortBus = require('shortbus')
const SSE = require('ngn-sse')
const http = require('http')
// const header = require('gulp-header')
// const jsHeaderComment = '/**\n  * v' + pkg.version +
//   ' generated on: ' + (new Date()) +
//   '\n  * Copyright (c) 2014-' + (new Date()).getFullYear() + ', ' +
//   (pkg.author.name || 'Unknown') + '. All Rights Reserved.\n  */\n'

const DIR = {
  SASS: path.join(__dirname, 'sass'),
  SASSOUTPUT: path.join(__dirname, 'dist', 'assets', 'css'),
  SOURCE: path.join(__dirname, 'src'),
  DIST: path.join(__dirname, 'dist')
}

const notifications = process.argv.indexOf('--notify') >= 0

let livereloadport
const createLiveReloadServer = function (callback) {
  let server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.url.indexOf('livereload.js') >= 0) {
      res.writeHead(200, {'Content-Type': 'text/javascript'})
      res.end(`
      'use strict'
      var es = new EventSource("http://localhost:${livereloadport}/sse")

      // Handle a specific event type/topic
      es.addEventListener('reload', function(e){
        if (e.data === 'now') {
          console.warn('Reloading NOW!')
          document.location = window.location.href
        } else if (e.data === 'queue') {
          console.warn('Queued to reload...')
        }
      })
      `)
      return
    }
  })

  server.listen(function() {
    let sse = new SSE(server)

    livereloadport = server.address().port

    sse.on('connection', function(sseclient) {
      // console.log(Object.keys(sseclient.req.client))
      gutil.log(chalk.gray('Livereload client connection established.'))
      client = sseclient
    })

    gutil.log(chalk.bgGreen.black('Livereload' + ' Server running on port ' + livereloadport))
    gutil.log(chalk.yellow('WARNING  Livereload is not available via ') + chalk.red.bold('https'))
    callback()
  })
}

let client
const reload = function () {
  if (!client) {
    return
  }

  gutil.log('Livereload ' + chalk.gray('Reloading'))
  client.send({
    event: 'reload',
    data: 'now'
  })

  setTimeout(() => {
    gulp.src('./').pipe(notify('Reloaded ' + pkg.name))
  }, 450)
}


const CHASSIS = require('chassis-sass').includePaths
const CHASSISDETAILER = require('chassis-detailer').includePaths

gulp.task('sasscompile', function () {
  fs.ensureDir(DIR.SASSOUTPUT)

  let PROJECT = path.join(DIR.SASS, '**', '*.s*ss')

  return gulp.src([PROJECT])
    .pipe(
      sass({
        // outputStyle: 'compressed',
        includePaths: [
          CHASSIS,
          CHASSISDETAILER,
          PROJECT
        ]
      })
    ).on('error', sass.logError)
    .pipe(gulp.dest(DIR.SASSOUTPUT))
})

gulp.task('clean', function (next) {
  fs.emptyDir(DIR.DIST, next)
})

gulp.task('copy', function (next) {
  let tasks = new ShortBus()

  fs.readdirSync(DIR.SOURCE).forEach(filepath => {
    tasks.add('Copy ' + filepath + ' to distribution.', function (cont) {
      fs.copy(path.join(DIR.SOURCE, filepath), path.join(DIR.DIST, filepath), cont)
    })
  })

  // tasks.on('stepstarted', (task) => {
  //   gutil.log('Build    ' + chalk.gray(task.name))
  // })

  tasks.on('stepcomplete', (task) => {
    gutil.log('Build    ' + chalk.gray(task.name))
  })

  tasks.on('complete', function () {
    // Add live reload support where appropriate
    let htmlList = []
    fs.walk(DIR.DIST)
      .on('readable', function () {
        let item
        while ((item = this.read())) {
          if (['.html', '.htm'].indexOf(path.extname(item.path)) >= 0) {
            htmlList.push(item.path)
          }
        }
      })
      .on('end', function () {
        if (htmlList.length > 0) {
          htmlList.forEach(file => {
            let content = fs.readFileSync(file).toString()
            if (content.indexOf('<!-- LIVERELOAD -->') >= 0) {
              content = content.replace(/<\!-- LIVERELOAD -->/gi, '<script src="http://localhost:' + livereloadport + '/livereload.js"></script>')
              fs.writeFileSync(file.replace(DIR.SOURCE, DIR.DIST), content)
            }
          })
        }

        next()
      })
  })

  tasks.process()
})

gulp.task('watch', function (next) {
  gulp.watch([
    DIR.SASS,
    DIR.SASS + '/**/*.s*ss',
    require('chassis-sass').includePaths,
    require('chassis-detailer').includePaths
  ], gulp.series(['build']))

  let monitoredFileTypes = [
    '.js',
    '.min.js',
    '.css',
    '.htm',
    '.html'
  ]

  gulp.watch([
    DIR.SOURCE + '/**/*'
  ]).on('change', function (delta) {
    gutil.log('Monitor   ' + chalk.gray(delta.replace(DIR.SOURCE, '') + ' changed.'))

    // Update livereload capabilities in any source files.
    if (['.html', '.htm'].indexOf(path.extname(delta)) >= 0) {
      let content = fs.readFileSync(delta).toString()
      if (content.indexOf('<!-- LIVERELOAD -->') >= 0) {
        content = content.replace(/<\!-- LIVERELOAD -->/gi, '<script src="http://localhost:' + livereloadport + '/livereload.js"></script>')
        gutil.log('Build     ' + chalk.gray('Applying Livereload code.'))
        fs.writeFileSync(delta.replace(DIR.SOURCE, DIR.DIST), content)
        reload()
        return
      }
    }

    gutil.log('Build     ' + chalk.gray('Copying ' + delta.replace(DIR.SOURCE, '') + ' to distribution.'))

    if (monitoredFileTypes.indexOf(path.extname(delta)) >= 0) {
      reload()
    }

    fs.copySync(delta, delta.replace(DIR.SOURCE, DIR.DIST))
  }).on('add', function (filepath) {
    if (['.html', '.htm'].indexOf(path.extname(filepath)) >= 0) {
      let content = fs.readFileSync(filepath).toString()
      if (content.indexOf('<!-- LIVERELOAD -->') >= 0) {
        content = content.replace(/<\!-- LIVERELOAD -->/gi, '<script src="http://localhost:' + livereloadport + '/livereload.js"></script>')
        gutil.log('Build     ' + chalk.gray('Created ' + filepath.replace(DIR.SOURCE, '')))
        gutil.log('Build     ' + chalk.gray('Applying Livereload code.'))
        fs.writeFileSync(filepath.replace(DIR.SOURCE, DIR.DIST), content)
        return
      }
    }

    gutil.log('Build     ' + chalk.gray('Copying ' + filepath.replace(DIR.SOURCE, '') + ' to distribution.'))
    fs.copySync(filepath, filepath.replace(DIR.SOURCE, DIR.DIST))
  }).on('unlink', function (filepath) {
    gutil.log('Build     ' + chalk.gray('Removed ' + filepath.replace(DIR.SOURCE, '')))
  })

  // Start watching the distribution directory after the first build.
  setTimeout(function () {
    gulp.watch([
      DIR.DIST + '/**/*.css',
      DIR.DIST + '/**/*.js',
      DIR.DIST + '/**/*.html'
    ]).on('change', reload)

    gutil.log('Monitor  ', chalk.cyan('Watching distribution directory for changes.'))
  }, 1000)

  next()
})

gulp.task('launchlivereloadserver', function (next) {
  createLiveReloadServer(function () {
    setTimeout(next, 600)
  })
})

gulp.task('dependencycheck', function (next) {
  depalert()
  next()
})

gulp.task('build', gulp.series(['clean', 'copy', 'sasscompile']))
gulp.task('dev', gulp.series(['dependencycheck', 'launchlivereloadserver', 'build', 'watch']))
