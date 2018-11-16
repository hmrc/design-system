const path = require('path')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const pathFromRoot = require('./util').pathFromRoot

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

gulp.task('scss:compile', ['scss:pattern-libraries', 'scss:hmrc-design-system'])

gulp.task('scss:watch', () => {
  return gulp.watch(pathFromRoot('**', '*.scss'), ['build'])
})

gulp.task('scss:hmrc-design-system', () => {
  // TODO: compile an Old IE version of our local css
  return gulp.src('./application/scss/hmrc-design-system.scss')
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('scss:pattern-libraries', () => {
  const isIE = (file) => path.parse(file.path).name.includes('ie')

  return gulp.src(scssPaths, { base: 'node_modules' })
    .pipe(plumber(errorHandler))
    .pipe(sass())
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(gulpif(isIE, postcss([
      require('oldie')({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true }
        // more rules go here
      })
    ])))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('all', path.dirname)
      path.dirname = 'assets/stylsheets'
      path.extname = '.min.css'
    }))
    .pipe(gulp.dest('./dist'))
})
