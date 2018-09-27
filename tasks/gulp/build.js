const gulp = require('gulp')
const logger = require('gulp-util').log

gulp.task('build', () => {
  logger('Metalsmith build starting')
  const Metalsmith = require('metalsmith')
  const inPlace = require('metalsmith-in-place')
  const path = require('path')
  const debug = require('metalsmith-debug')
  const projectRoot = path.join(__dirname, '..', '..')

  const templatePaths = [
    path.join(projectRoot, 'application', 'templates'),
    path.join(projectRoot, 'src')
  ]

  return Metalsmith(projectRoot)
    .use(debug())
    .source('./src')
    .destination('./dist')
    .clean(true)
    .use(inPlace({
      engine: 'nunjucks',
      pattern: '**/*.njk',
      engineOptions: {
        path: templatePaths
      }
    }))
    .build((err) => {
      if (err) throw err
    })
})
