// npm install gulp@^3.9.1 gulp-imagemin gulp-gzip gulp-brotli --save-dev

/*
 * These are small utility tasks to pre-zip files and optimize image compression.
 * It is not Angular-specific, but is set up to post-process the generated "dist" folder.
 */

const dist = './dist/angular-material-kickstart/';

const
  gulp = require('gulp'),
  gzip = require('gulp-gzip'),
  brotli = require('gulp-brotli'),
  imagemin = require('gulp-imagemin');

gulp.task('gzip', () => {
  gulp.src([dist + '*', '!**/*.{br,gz}'])
    .pipe(gzip())
    .pipe(gulp.dest(dist));
});

gulp.task('brotli', () => {
  gulp.src([dist + '*', '!**/*.{br,gz}'])
    .pipe(brotli.compress())
    .pipe(gulp.dest(dist));
});

gulp.task('imagemin', () => {
  gulp.src(dist + '**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest(dist))
});
