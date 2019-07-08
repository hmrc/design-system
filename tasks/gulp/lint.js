const gulp = require('gulp')
const standard = require('gulp-standard')

const pathFromRoot = require('../../util/pathFromRoot')

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

gulp.task('lint', gulp.parallel(
  'lint:gulpTasks',
  'lint:assetsScripts',
  'lint:applicationScripts',
  'lint:tests'
))
