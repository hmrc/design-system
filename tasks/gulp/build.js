const gulp = require('gulp')
const util = require('gulp-util')

gulp.task('build', (done) => {
  util.log('Metalsmith build starting')
  const Metalsmith = require('metalsmith')
  const inPlace = require('metalsmith-in-place')
  const debug = require('metalsmith-debug')
  const metalsmithPath = require('metalsmith-path')
  const path = require('path')
  const projectRoot = path.join(__dirname, '..', '..')
  const filters = require('../../application/filters/filters')

  const templatePaths = [
    path.join(projectRoot, 'application', 'templates'),
    path.join(projectRoot, 'application', 'macros'),
    path.join(projectRoot, 'src')
  ]

  Metalsmith(projectRoot)
    .use(debug())
    .source('./src')
    .destination('./dist')
    .clean(true)
    .use(metalsmithPath({
      property: 'filepath',
      extensions: ['.njk', '.html']
    }))
    .use(inPlace({
      engine: 'nunjucks',
      pattern: '**/*.njk',
      engineOptions: {
        noCache: true,
        path: templatePaths,
        filters: { is_array: filters.isArray, dirname: filters.getDirectoryFromFilepath }
      }
    }))
    .build((err) => {
      if (err) throw err
      done()
    })
    console.log(Metalsmith)
})
