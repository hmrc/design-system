const gulp = require('gulp')
const pathFromRoot = require('./util').pathFromRoot

gulp.task('copy-assets', () => gulp
  .src(pathFromRoot('node_modules', 'govuk-frontend', 'assets', '**', '*'))
  .pipe(gulp.dest(pathFromRoot('dist', 'assets')))
)
