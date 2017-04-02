var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var maxLineLen = 800;
var mapsDest = 'src/';
var allStyles = 'css/**/*.css'
var styleFileName = 'style.css'
var styleDest = 'src/public/css/';
var styleSrc = 'src/public/sass/style.scss';
var styleWatchFiles = 'src/public/sass/**/*.scss';

gulp.task('style', function(){
  gulp.src(styleSrc)
      .pipe(sourcemaps.init({largeFile: true }))
      .pipe(sass({outputStyle: 'expanded'}))
      .on('error', sass.logError).pipe(sourcemaps.write(mapsDest))
      .pipe(gulp.dest(styleDest))
});

gulp.task('default', ['style'], function() {
  gulp.watch(styleWatchFiles, ['style']);
});
