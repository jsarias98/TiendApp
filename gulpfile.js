/* jshint node:true */
'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var argv = require('yargs').argv;
var minifyCss = require("gulp-minify-css");
var $ = require('gulp-load-plugins')();

/*gulp.task('styles', function() {
  return gulp.src([
      'app/styles/less/app-orange.less'
    ])
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('board/styles'))
    .pipe(gulp.dest('app/styles'))
    .pipe(gulp.dest('.tmp/styles'));
});*/
var processLess = function(src, board, app, tmp, filename) {
  return gulp.src(src)
    .pipe($.concat(filename))
    .pipe($.sass())
    .pipe($.postcss([$.autoprefixer]))
    .pipe(minifyCss())
    .pipe($.replace("app/styles", "app/styles"))
    .pipe(gulp.dest(board))
    .pipe(gulp.dest(app))
    .pipe(gulp.dest(tmp));
};
var srcStyles = [
  "app/styles/main.scss"
];
 
gulp.task("styles", function() {
  return processLess(srcStyles, "board/styles","app/styles",".tmp/styles", "main.min.css");
});
 
gulp.task('default', function() {
  gulp.start('styles');
  gulp.watch(srcStyles, ['styles']);
});
gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    //.pipe($.jshint.reporter('jshint-stylish'))
    //.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jscs());
});

gulp.task('html', ['styles'], function() {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/materialize/fonts/roboto', 'fonts');

  //var assets = $.useref({searchPath: '{.tmp,app}'});
  return gulp.src('app/**/*.html')
    .pipe($.useref({searchPath: '{.tmp,app}'}))
    .pipe($.if('*.js', $.ngAnnotate({add:true})))
    .pipe($.if('*.js', $.babel()))
    .pipe($.if('*.js', $.uglify({mangle:false})))
    .pipe($.if('*.css', cssChannel()))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('board'));
});


gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    // .pipe($.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true
    // })))
    .pipe(gulp.dest('board/images'));
});
gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')().concat('app/styles/fonts/**/*')
    .concat('bower_components/materialize/fonts/roboto/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('board/fonts'))
    .pipe(gulp.dest('app/fonts'))
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('extras', function() {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/board/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('board'));
});
gulp.task('clean', require('del').bind(null, ['.tmp']));

gulp.task('connect', ['styles'], function() {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9500)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9500');
    });
});

gulp.task('serve', ['wiredep', 'connect', 'fonts', 'watch'], function() {
  if (argv.open) {
    require('opn')('http://localhost:9500');
  }
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done);
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  var exclude = [
    'jquery',
    'bootstrap',
    'es5-shim',
    'json3',
    'angular-scenario'
  ];

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({exclude: exclude}))
    .pipe(gulp.dest('app'));

  gulp.src('test/*.js')
    .pipe(wiredep({exclude: exclude, devDependencies: true}))
    .pipe(gulp.dest('test'));
});

gulp.task('watch', ['connect'], function() {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/**/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('buildboard', ['jshint', 'html', 'images', 'fonts', 'extras', 'styles',],
  function() {
  return gulp.src('board/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build', ['clean'], function() {
  gulp.start('buildboard');
});

gulp.task('docs', [], function() {
  return gulp.src('app/scripts/**/**')
    .pipe($.ngdocs.process())
    .pipe(gulp.dest('./docs'));
});
