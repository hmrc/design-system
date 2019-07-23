const gulp = require('gulp')
const merge2 = require('merge2')
const remoteSrc = require('gulp-remote-src')
const pathFromRoot = require('../../util/pathFromRoot')
const readExtensionConfigSync = require('../../util/extensions')

const assetsFromExtensions = readExtensionConfigSync('assets').map(item => pathFromRoot(... `node_modules/${item.module}${item.item}/**/*`.split('/')))

const assetPaths = [
  pathFromRoot('application', 'assets', '**', '*'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'components', '**', '*'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'hmrc-design-system.js')
]

gulp.task('copy-assets:local', (done) => {
  const assets = gulp.src(assetPaths)
    .pipe(gulp.dest(pathFromRoot('dist', 'assets')))

  const extensionAssets = gulp.src(assetsFromExtensions, { base: pathFromRoot('node_modules') })
    .pipe(gulp.dest(pathFromRoot('dist', 'extension-assets')))

  const mergedStream = merge2(assets, extensionAssets)
  mergedStream.on('queueDrain', (done))
})

// TODO: do we need any of these?
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
