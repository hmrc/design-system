const gulp = require('gulp')
const pathFromRoot = require('./util').pathFromRoot

const assetPaths = [
  pathFromRoot('application', 'assets', '**', '*'),
  pathFromRoot('node_modules', 'govuk-frontend', 'assets', '**', '*')
]

gulp.task('copy-assets', () => {
  return gulp.src(assetPaths).pipe(gulp.dest(pathFromRoot('dist', 'assets')))
})

gulp.task('copy-assets:watch', () => {
  gulp.watch(assetPaths, ['copy-assets'])
})
