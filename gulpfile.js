// Include gulp
var gulp = require('gulp');

// Stylesheets and scripts
var styles = ['./src/css/style.css', './src/css/fluidbox.css'];
var scripts = ['./src/js/jquery.min.js', './src/js/masonry.min.js', './src/js/imagesloaded.min.js', './src/js/fluidbox.min.js', './src/js/script.js'];

// Include plugins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var useref = require('gulp-useref');

// Gulp tasks
gulp.task('lint', function() {
  gulp.src('./src/js/script.js')
    .pipe(stripDebug())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
  gulp.src(styles)
  .pipe(concat('style.css'))
  .pipe(autoprefix('last 2 versions', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifyCSS())
  .pipe(gulp.dest('./dist/assets/css/'));
});

gulp.task('html', function() {
  gulp.src('./src/*.html')
  .pipe(useref())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('img', function() {
  gulp.src('./src/img/*')
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
  .pipe(gulp.dest('./dist/assets/img/'));
});

gulp.task('js', function() {
  gulp.src(scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/assets/js/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js/'));
});

gulp.task('default', ['html', 'css', 'img', 'js'], function() {

});