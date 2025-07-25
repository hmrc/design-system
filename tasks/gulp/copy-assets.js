const gulp = require('gulp')
const merge2 = require('merge2')
const pathFromRoot = require('../../util/pathFromRoot')
const readExtensionConfigSync = require('../../util/extensions')

const assetsFromExtensions = readExtensionConfigSync('assets').map(item => pathFromRoot(... `node_modules/${item.module}${item.item}/**/*`.split('/')))

const assetPaths = [
  pathFromRoot('application', 'assets', '**', '*'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'components', '**', '*'),
  '!' + pathFromRoot('application', 'assets', 'javascripts', 'hmrc-design-system.js'),
  pathFromRoot('node_modules', 'hmrc-frontend', 'hmrc', 'accessible-autocomplete-*')
]

gulp.task('copy-assets', (done) => {
  const assets = gulp.src(assetPaths)
    .pipe(gulp.dest(pathFromRoot('dist', 'assets')))

  const extensionAssets = gulp.src(assetsFromExtensions, { base: pathFromRoot('node_modules') })
    .pipe(gulp.dest(pathFromRoot('dist', 'extension-assets')))

  const mergedStream = merge2(assets, extensionAssets)
  mergedStream.on('queueDrain', (done))
})

gulp.task('copy-assets:watch', (done) => {
  gulp.watch(assetPaths, gulp.parallel('copy-assets'))
  done()
})
