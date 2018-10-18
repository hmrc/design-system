const gulp = require('gulp')
const pathFromRoot = require('./util').pathFromRoot
const gulpSequence = require('gulp-sequence')

gulp.task('copy-assets:govuk-frontend', () => gulp
  .src(pathFromRoot('node_modules', 'govuk-frontend', 'assets', '**', '*'))
  .pipe(gulp.dest(pathFromRoot('dist', 'assets')))
)

gulp.task('copy-assets:application', () => gulp
  .src(pathFromRoot('application', 'assets', '**', '*'))
  .pipe(gulp.dest(pathFromRoot('dist', 'assets')))
)

gulp.task('copy-assets', gulpSequence(['copy-assets:govuk-frontend', 'copy-assets:application']))
