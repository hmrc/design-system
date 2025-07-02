const path = require('path')
const gulp = require('gulp')
const log = require('fancy-log')
const Metalsmith = require('metalsmith')
const inPlace = require('@metalsmith/in-place')
const debug = require('metalsmith-debug')
const metalsmithPath = require('metalsmith-path')
const layouts = require('@metalsmith/layouts')
const ignore = require('@metalsmith/remove')
const rollup = require('metalsmith-rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const filters = require('../../lib/filters')
const globals = require('../../lib/globals')
const templatePaths = require('../../lib/templatePaths')

const navigation = require('../../lib/navigation')
const section = require('../../lib/section')

const pathFromRoot = require('../../util/pathFromRoot')
const projectRoot = pathFromRoot()

const pattern = '**/*{.njk,.html}'

gulp.task('compile', (done) => {
  log('Metalsmith build starting')

  Metalsmith(projectRoot)
    .use(ignore(['**/__tests__/*', 'all-patterns/*']))
    .source('./src')
    .destination('./dist')
    .clean(true)
    .use(metalsmithPath({
      property: 'filepath',
      extensions: ['.njk', '.html'],
      directoryIndex: 'index.njk'
    }))
    .use(section())
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
      transform: 'jstransformer-nunjucks',
      pattern: pattern,
      engineOptions: {
        noCache: true,
        trimBlocks: true,
        lstripBlocks: true,
        path: templatePaths,
        filters,
        globals: {
          ...globals,
          govukRebrand: true
        }
      }
    }))
    .use(layouts({
      default: 'default.njk',
      directory: pathFromRoot('application', 'templates'),
      pattern: '**/*.html',
      engineOptions: {
        path: templatePaths,
        globals: {
          ...globals,
          govukRebrand: true
        }
      }
    }))
    .use(debug())
    .build((err) => {
      if (err) throw err
      done()
    })
})

gulp.task('build:watch', (done) => {
  templatePaths.forEach(pathStr => {
    gulp.watch(path.join(pathStr, pattern), gulp.parallel('rebuild'))
  })

  gulp.watch(pathFromRoot('application', 'assets', 'javascripts', '**', '*'), gulp.parallel('rebuild'))
  done()
})
