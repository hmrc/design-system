const gulp = require('gulp')
const merge = require('merge-stream')
const remoteSrc = require('gulp-remote-src')
const pathFromRoot = require('../../util/pathFromRoot')

const assetPaths = [
  pathFromRoot('node_modules', 'govuk-frontend', 'assets/'),
  pathFromRoot('application', 'assets/'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'components/'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'hmrc-design-system.js')
]

gulp.task('copy-assets:local', () => {
  const assets = gulp.src(assetPaths)
    .pipe(gulp.dest(pathFromRoot('dist', 'assets')))

  const jquery = gulp.src(pathFromRoot('node_modules', 'jquery', 'dist/'))
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'javascripts', 'vendor', 'jquery')))

  return merge(assets, jquery)
})

gulp.task('copy-assets:remote', () => {
  return remoteSrc([
    'collapsible.js',
    'collapsible_collection.js',
    'current_location.js'
  ], {
    base: 'https://raw.githubusercontent.com/alphagov/manuals-frontend/master/app/assets/javascripts/modules/'
  })
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'javascripts', 'vendor', 'govuk')))
})

gulp.task('copy-assets:watch', (done) => {
  gulp.watch(assetPaths, gulp.parallel('copy-assets'))
  done()
})

gulp.task('copy-assets', gulp.parallel('copy-assets:local', 'copy-assets:remote'))
