// npm install gulp@^4 gulp-imagemin@^7 gulp-gzip@^1 gulp-brotli@^3 --save-dev

/*
 * These are small utility tasks to pre-zip files and optimize image compression.
 * It is not Angular-specific, but is set up to post-process the generated "dist" folder.
 */

const dist = './dist/angular-material-kickstart/';

const {src, dest, parallel, series} = require('gulp'),
  gulpGzip = require('gulp-gzip'),
  gulpBrotli = require('gulp-brotli'),
  gulpImagemin = require('gulp-imagemin');

function gzip() {
  return src([dist + '**/*.{js,html}'])
    .pipe(gulpGzip())
    .pipe(dest(dist));
}

function brotli() {
  return src([dist + '**/*.{js,html}'])
    .pipe(gulpBrotli.compress())
    .pipe(dest(dist));
}

function imagemin() {
  return src(dist + '**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(gulpImagemin())
    .pipe(dest(dist))
}

exports.default = parallel(gzip, brotli, imagemin);
