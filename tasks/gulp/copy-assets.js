const gulp = require('gulp')
const merge = require('merge-stream')
const remoteSrc = require('gulp-remote-src')
const pathFromRoot = require('./util').pathFromRoot

gulp.task('copy-assets', () => {
  const assets = gulp.src([
    pathFromRoot('node_modules', 'govuk-frontend', 'assets', '**', '*'),
    pathFromRoot('application', 'assets', '**', '*')
  ])
    .pipe(gulp.dest(pathFromRoot('dist', 'assets')))

  const jquery = gulp.src(pathFromRoot('node_modules', 'jquery', 'dist', '*'))
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'javascripts', 'vendor', 'jquery')))

  const collapsible = remoteSrc([
    'collapsible.js',
    'collapsible_collection.js',
    'current_location.js'
  ], { base: 'https://raw.githubusercontent.com/alphagov/manuals-frontend/master/app/assets/javascripts/modules/' })
    .pipe(gulp.dest(pathFromRoot('dist', 'assets', 'javascripts', 'vendor', 'govuk')))

  return merge(assets, jquery, collapsible)
})
