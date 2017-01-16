var args = require('yargs').argv
var gulp = require('gulp')
var pkg = require('./package.json')
var sort = require('gulp-filename-sort')
var es = require('event-stream')
var $ = require('gulp-load-plugins')()
var bowerFiles = require('main-bower-files')
var Q = require('q')
var del = require('del')

var paths = pkg.paths

var config = {
  validate: false,
  sourceMap: false,
  isProd: false,
  imgmin: args.img,
  cssmin: args.css,
  ngConfigModule: 'koala.config',
  env: 'production',
  testEnv: 'local',
  prodEnv: 'production',
}

var lazyLoadVendorFiles = [
  "bower_components/echarts/build/dist/echarts-all.js",
  "bower_components/angular-echarts/dist/angular-echarts.min.js"
]

var preFiles = ['bootstrap.css', 'font-awesome.css', 'chosen.min.css' , 'chosen.min.css','jquery.js', 'moment.js', 'bignumber.js','lodash.js', 'angular.js']

var pipes = {}

pipes.buildStyles = function () {
  log('Build styles...')
  var css = gulp.src('./views/**/*.css')
    .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))

  var less = gulp.src('./views/**/*.less')
    .pipe($.if(config.sourceMap, $.sourcemaps.init()))
    .pipe($.less())
    .pipe($.if(config.sourceMap, $.sourcemaps.write()))

  return es.merge(less, css)
    .pipe(sort({previous: preFiles}))
    .pipe(gulp.dest('./dist/'))
}

pipes.es6files = function () {
  return gulp.src('./views/**/*.js')
    .pipe($.if(config.validate, $.eslint()))
    .pipe($.if(config.validate, $.eslint.format()))
    .pipe($.if(config.sourceMap, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(config.sourceMap, $.sourcemaps.write()))
}

pipes.buildScripts = function () {
  log('Build scripts...')

  var es6files = pipes.es6files()

  return es.merge(es6files)
    .pipe( gulp.dest('./dist/'))
}

pipes.buildBower = function () {

  return  gulp.src(bowerFiles())
    .pipe($.filter('**/*.{js,css}'))
    .pipe(sort({previous: preFiles}))
    .pipe(gulp.dest('./dist/bower/'))
}

pipes.buildFonts = function () {
  return gulp.src('./views/**/*')
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('./dist/fonts/'))
}

pipes.buildImages = function () {
  log('Images process...')
  return gulp.src('./views/images/**/*')
    .pipe($.if(false, $.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest("./dist/images/"))
}

pipes.buildOther = function () {
  log('Copy other file...')
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile()
  })

  return gulp.src(["views/**/*","!views/index.html"], {base: 'views'})
    .pipe(fileFilter)
    .pipe(gulp.dest('./dist/'))
}

pipes.buildLazyLoadFiles = function () {
  log('Copy lazy load files...')

  return gulp.src(lazyLoadVendorFiles)
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist.bower))
}

pipes.processDev = function () {

  var styles = pipes.buildStyles()

  var scripts = pipes.buildScripts()
    .pipe($.ngAnnotate())
    .pipe($.angularFilesort())
    .on('error', handleError)

  //var ngconfig = pipes.ngconfig()

  //var mergeScript = es.merge(scripts, ngconfig)

  var bower = pipes.buildBower()

  var injectOptions = {
    ignorePath: 'dist',
    addRootSlash: false
  }

  var inejectBowerOptions = {
    name: 'bower',
    ignorePath: 'dist',
    addRootSlash: false
  }

  log('Index inject styles and scripts...')
  var injectedIndex = gulp.src('./views/index.html')
    .pipe($.inject(bower, inejectBowerOptions))
    .pipe($.inject(styles, injectOptions))
    .pipe($.inject(scripts, injectOptions))
    .pipe(gulp.dest('./dist'))

  return es.merge(styles, scripts, bower, injectedIndex)
}

gulp.task('clean', function () {
  log("Delete dist and tmp...")
  var deferred = Q.defer()
  del(['dist'], function () {
    deferred.resolve()
  })
  return deferred.promise
})

gulp.task('dev', function () {
  return es.merge(pipes.processDev(), pipes.buildOther(), pipes.buildImages(), pipes.buildFonts()) //pipes.buildLazyLoadFiles()
})

gulp.task('watch', ['dev'], function () {
  watch()
  takeoff()
})

function watch() {
  $.livereload.listen({ start: true })

  gulp.watch('./views/index.html', function () {
    return pipes.processDev()
      .pipe($.livereload())
  })

  gulp.watch('./views/**/*.js', function () {
    return pipes.buildScripts()
      .pipe($.livereload())
  })

  gulp.watch('./views/css/**/*.css', function () {
    return pipes.buildStyles()
      .pipe($.livereload())
  })

  gulp.watch('./views/css/**/*.less', function () {
    return pipes.buildStyles()
      .pipe($.livereload())
  })


  gulp.watch('./views/images/', function () {
    return pipes.buildImages()
      .pipe($.livereload())
  })

  gulp.watch(["views/**/*.html", "!views/index.html"], function () {
    return pipes.buildOther()
      .pipe($.livereload())
  })

  log('正在监听数据变动')
}

function takeoff() {
  $.nodemon({
    script: 'server/app.js',
    ext: 'js',
    watch: ['server/'],
    env: { NODE_ENV: 'production' },
    execMap: {
      js: "node --harmony"
    }})
    .on('restart', function () {
      console.log('restarted')
    })
  log('页面程序正在启动')
}

function log(msg) {
  $.util.log($.util.colors.blue(msg))
}
// Error handler
function handleError(err) {
  log(err.toString())
  this.emit('end')
}