const path = require('path')
const gulp = require('gulp')
const util = require('gulp-util')
const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const metalsmithPath = require('metalsmith-path')
const ignore = require('metalsmith-ignore')
const navigation = require('../../lib/navigaiton')
const pathFromRoot = require('./util').pathFromRoot

const projectRoot = pathFromRoot()
const pattern = '**/*{.njk,.html}'

const templatePaths = [
  pathFromRoot('node_modules', 'hmrc-frontend', 'components'),
  pathFromRoot('application', 'templates'),
  pathFromRoot('application', 'templates', 'partials'),
  pathFromRoot('src')
]

gulp.task('compile', (done) => {
  util.log('Metalsmith build starting')
  const filters = require(pathFromRoot('application', 'filters', 'hmrc-design-system'))

  Metalsmith(projectRoot)
    .source('./src')
    .destination('./dist')
    .clean(true)
    .use(metalsmithPath({
      property: 'filepath',
      extensions: ['.njk', '.html']
    }))
    .use(navigation())
    .use(inPlace({
      engine: 'nunjucks',
      pattern: pattern,
      engineOptions: {
        noCache: true,
        path: templatePaths,
        filters: { is_array: filters.isArray, dirname: filters.getDirectoryFromFilepath }
      }
    }))
    .use(debug())
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
