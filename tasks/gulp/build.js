const path = require('path')
const gulp = require('gulp')
const util = require('gulp-util')
const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const metalsmithPath = require('metalsmith-path')
const layouts = require('metalsmith-layouts')

const rollup = require('metalsmith-rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

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
    .use(rollup({
      input: pathFromRoot('application', 'assets', 'javascripts', 'hmrc-design-system.js'),
      output: {
        legacy: true,
        format: 'iife',
        file: 'assets/javascripts/hmrc-design-system.js'
      },
      plugins: [
        resolve(),
        commonjs()
      ]
    }))
    .use(inPlace({
      engine: 'nunjucks',
      pattern: pattern,
      engineOptions: {
        noCache: true,
        trimBlocks: true,
        lstripBlocks: true,
        path: templatePaths,
        filters: {
          is_array: filters.isArray,
          dirname: filters.getDirectoryFromFilepath
        }
      }
    }))
    .use(layouts({
      default: 'default.njk',
      directory: pathFromRoot('application', 'templates'),
      pattern: '**/*.html',
      engineOptions: {
        path: templatePaths
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
