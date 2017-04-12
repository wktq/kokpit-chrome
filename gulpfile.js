var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(){
  gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css', {overwrite: true}));
});

gulp.task('sass-watch', ['sass'], function() {
  var watcher = gulp.watch('./scss/style.scss', ['sass']);
  watcher.on('change', function(event) {
  });
});

gulp.task('default', ['sass-watch']);
