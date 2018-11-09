const gulp = require('gulp')
const util = require('gulp-util')
const path = require('path')
const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const metalsmithPath = require('metalsmith-path')
const ignore = require('metalsmith-ignore')
const pathFromRoot = require('./util').pathFromRoot

const projectRoot = pathFromRoot()
const pattern = '**/*{.njk,.html}'

const templatePaths = [
  pathFromRoot('application', 'templates'),
  pathFromRoot('application', 'macros'),
  pathFromRoot('src')
]

gulp.task('compile', (done) => {
  util.log('Metalsmith build starting')
  const filters = require('../../application/filters/hmrc-design-system')

  Metalsmith(projectRoot)
    .source('./src')
    .destination('./dist')
    .clean(true)
    .use(debug())
    .use(metalsmithPath({
      property: 'filepath',
      extensions: ['.njk', '.html']
    }))
    .use(inPlace({
      engine: 'nunjucks',
      pattern: pattern,
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
})

gulp.task('build:watch', () => {
  templatePaths.forEach(pathStr => {
    gulp.watch(path.join(pathStr, pattern), ['build'])
  })
})
