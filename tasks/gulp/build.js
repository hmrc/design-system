const gulp = require('gulp')
const logger = require('gulp-util').log
const path = require('path')
const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const pathFromRoot = require('./util').pathFromRoot

const projectRoot = pathFromRoot()
const pattern = '**/*.njk'

const templatePaths = [
  pathFromRoot('application', 'templates'),
  pathFromRoot('src')
]

gulp.task('build', (done) => Metalsmith(projectRoot)
  .use(debug())
  .source('./src')
  .destination('./dist')
  .use(inPlace({
    engine: 'nunjucks',
    pattern: pattern,
    engineOptions: {
      path: templatePaths
    }
  }))
  .build((err) => {
    if (err) throw err
    done()
  })
)

gulp.task('build:watch', () => {
  templatePaths.forEach(pathStr => {
    gulp.watch(path.join(pathStr, pattern), ['build:full'])
  })
})
