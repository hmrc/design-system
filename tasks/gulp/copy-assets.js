const gulp = require('gulp')
const merge2 = require('merge2')
const remoteSrc = require('gulp-remote-src')
const pathFromRoot = require('../../util/pathFromRoot')

const assetPaths = [
  pathFromRoot('node_modules', 'govuk-frontend', 'assets', '**', '*'),
  pathFromRoot('application', 'assets', '**', '*'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'components', '**', '*'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'hmrc-design-system.js')
]

gulp.task('copy-assets:local', (done) => {
  const assets = gulp.src(assetPaths)
    .pipe(gulp.dest(pathFromRoot('dist', 'assets')))

  // TODO (https://jira.tools.tax.service.gov.uk/browse/PLATUI-118)
  const componentImages = gulp.src(pathFromRoot('node_modules', 'hmrc-frontend', 'components', 'hmrc-account-menu', 'images', '*'))
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'stylesheets', 'components', 'hmrc-account-menu', 'images')))

  const jquery = gulp.src(pathFromRoot('node_modules', 'jquery', 'dist', '*'))
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'javascripts', 'vendor', 'jquery')))

  const mergedStream = merge2(assets, jquery, componentImages)
  mergedStream.on('queueDrain', (done))
})

gulp.task('copy-assets:remote', (done) => {
  remoteSrc([
    'collapsible.js',
    'collapsible_collection.js',
    'current_location.js'
  ], {
    base: 'https://raw.githubusercontent.com/alphagov/manuals-frontend/master/app/assets/javascripts/modules/'
  })
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'javascripts', 'vendor', 'govuk'))
      .on('end', done))
})

gulp.task('copy-assets:watch', (done) => {
  gulp.watch(assetPaths, gulp.parallel('copy-assets'))
  done()
})

gulp.task('copy-assets', gulp.parallel('copy-assets:local', 'copy-assets:remote'))
