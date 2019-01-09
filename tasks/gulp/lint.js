const gulp = require('gulp')
const pathFromRoot = require('./util').pathFromRoot
const standard = require('gulp-standard')

gulp.task('lint', [
  'lint:gulpTasks',
  'lint:assetsScripts',
  'lint:applicationScripts',
  'lint:tests'
])

gulp.task('lint:gulpTasks', () => {
  return gulp.src(pathFromRoot('tasks', 'gulp', '*.js'))
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})
gulp.task('lint:applicationScripts', () => {
  return gulp.src([
    pathFromRoot('application', 'filters', '*.js'),
    pathFromRoot('application', 'lib', '*.js')
  ])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('lint:assetsScripts', () => {
  return gulp.src(pathFromRoot('application', 'assets', 'javascripts', '*.js'))
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('lint:tests', () => {
  return gulp.src([
    pathFromRoot('application', '__tests__', '*.js'),
    pathFromRoot('application', 'lib', '__tests__', '*.js')
  ])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})
