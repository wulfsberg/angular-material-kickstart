// yarn add gulp gulp-imagemin gulp-gzip --dev

/*
 * These are small utility tasks to pre-zip files and optimize image compression.
 * It is not Angular-specific, but is set up to post-process the generated "dist" folder.
 */

const
  gulp = require('gulp'),
  gzip = require('gulp-gzip'),
  imagemin = require('gulp-imagemin');

gulp.task('gzip', () => {
  gulp.src(['./dist/*'])
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('imagemin', () => {
  gulp.src('./dist/**/*.{jpg,jpeg,png,gif,svg}')
  // Angular Material's icons may use the defs and IDs for sprite sheets, so don't remove them:
    .pipe(imagemin([imagemin.svgo({plugins: [{cleanupIDs: false, removeUselessDefs: false}]})]))
    .pipe(gulp.dest('./dist/'))
});
