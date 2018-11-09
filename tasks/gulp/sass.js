const gulp = require('gulp')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const pathFromRoot = require('./util').pathFromRoot

const errorHandler = function (error) {
  // Log the error to the console
  console.error(error.message)

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1))
  this.emit('end')
}

gulp.task('scss:compile', ['scss:govuk-frontend', 'scss:hmrc-design-system'])

gulp.task('scss:watch', () => {
  return gulp.watch(pathFromRoot('**', '*.scss'), ['build'])
})

gulp.task('scss:hmrc-design-system', () => {
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

gulp.task('scss:govuk-frontend', () => {
  // ToDo: compile an Old IE version of our local css
  let compile = gulp.src('./node_modules/govuk-frontend/all.scss')
    .pipe(plumber(errorHandler))
    .pipe(sass())
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(rename({
      basename: 'govuk-frontend',
      extname: '.min.css'
    })
    )
    .pipe(gulp.dest('./dist'))

  let compileOldIe = gulp.src('./node_modules/govuk-frontend/all-ie8.scss')
    .pipe(plumber(errorHandler))
    .pipe(sass())
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(postcss([
      autoprefixer,
      cssnano,
      // transpile css for ie https://github.com/jonathantneal/oldie
      require('oldie')({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true }
        // more rules go here
      })
    ]))
    .pipe(postcss([
      autoprefixer,
      require('oldie')({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true }
        // more rules go here
      })
    ]))
    .pipe(
      rename({
        basename: 'govuk-frontend-ie8',
        extname: '.min.css'
      })
    )
    .pipe(gulp.dest('./dist'))

  return merge(compile, compileOldIe)
})
