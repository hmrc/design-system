const path = require('path')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const sass = require('gulp-sass')(require('sass'))
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const header = require('gulp-header')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

const pathFromRoot = require('../../util/pathFromRoot')

const scssPaths = [
  pathFromRoot('node_modules', 'govuk-frontend', '*.scss'),
  pathFromRoot('node_modules', 'hmrc-frontend', '*.scss')
]

const errorHandler = function (error) {
  // Log the error to the console
  console.error(error.message)

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1))
  this.emit('end')
}

gulp.task('scss:watch', (done) => {
  gulp.watch(pathFromRoot('**', '*.scss'), gulp.parallel('rebuild'))
  done()
})

gulp.task('scss:hmrc-design-system', (done) => {
  // TODO: compile an Old IE version of our local css
  // Also pertains to PLATUI-161: https://jira.tools.tax.service.gov.uk/browse/PLATUI-161 -->
  gulp.src('./application/scss/hmrc-design-system.scss')
    .pipe(sourcemaps.init())
    .pipe(header('$govuk-assets-path: "/extension-assets/govuk-frontend/dist/govuk/assets/";\n'))
    .pipe(header('$hmrc-assets-path: "/extension-assets/hmrc-frontend/hmrc/";\n'))
    .pipe(plumber(errorHandler))
    .pipe(sass({ quietDeps: true }))
    .pipe(postcss([ autoprefixer, cssnano ]))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .on('end', done)
})

gulp.task('scss:pattern-libraries', (done) => {
  const isIE = (file) => path.parse(file.path).name.includes('ie')

  gulp.src(scssPaths, { base: 'node_modules' })
    .pipe(sourcemaps.init())
    .pipe(plumber(errorHandler))
    .pipe(sass({ quietDeps: true }))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(postcss([ autoprefixer, cssnano ]))
    .pipe(rename((path) => {
      path.basename = path.dirname
      path.dirname = 'assets/stylesheets'
      path.extname = '.min.css'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .on('end', done)
})

gulp.task('scss:compile', gulp.parallel('scss:pattern-libraries', 'scss:hmrc-design-system'))
