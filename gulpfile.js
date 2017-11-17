// npm install gulp gulp-imagemin gulp-gzip gulp-brotli --save-dev

/*
 * These are small utility tasks to pre-zip files and optimize image compression.
 * It is not Angular-specific, but is set up to post-process the generated "dist" folder.
 */

const
  gulp = require('gulp'),
  gzip = require('gulp-gzip'),
  brotli = require('gulp-brotli'),
  imagemin = require('gulp-imagemin');

gulp.task('gzip', () => {
  gulp.src(['./dist/*', '!**/*.{br,gz}'])
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('brotli', () => {
  gulp.src(['./dist/*', '!**/*.{br,gz}'])
    .pipe(brotli.compress())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('imagemin', () => {
  gulp.src('./dist/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      // We use the defs and IDs for sprite sheets, so don't remove them:
      imagemin.svgo({plugins: [{cleanupIDs: false, removeUselessDefs: false}]})
    ]))
    .pipe(gulp.dest('./dist/'))
});
