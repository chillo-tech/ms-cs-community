/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const copyfiles = require('copyfiles');

gulp.task('copy-files', cb => {
  copyfiles(
    ['./src/mailsTemplates/**/*', './build/src'],
    {
      up: 1,
    },
    cb
  );
});

gulp.task('default', cb => {
  cb();
});
