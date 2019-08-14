const path = require('path')
const gulp = require('gulp')
const util = require('gulp-util')
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const Metalsmith = require('metalsmith')
const inPlace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const metalsmithPath = require('metalsmith-path')
const layouts = require('metalsmith-layouts')
const ignore = require('metalsmith-ignore')

const rollup = require('metalsmith-rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const filters = require('../../lib/filters')
const globals = require('../../lib/globals')
const templatePaths = require('../../lib/templatePaths')

const navigation = require('../../lib/navigation')

const pathFromRoot = require('../../util/pathFromRoot')
const projectRoot = pathFromRoot()

const pattern = '**/*{.njk,.html}'

gulp.task('scrape-examples', (done) => {
  let isFirstMatch = true
  gulp.src([
    // Entry point
    './src/all-patterns/index.njk',
    // All pattern examples
    './src/hmrc-design-patterns/*/*/index.njk',

    // Ignore non patterns
    '!./src/hmrc-design-patterns/hmrc-design-patterns-backlog/*/index.njk',
    '!./src/hmrc-design-patterns/install-hmrc-frontend-in-your-prototype/*/index.njk',
    '!./src/hmrc-design-patterns/updating-hmrc-frontend-in-your-prototype/*/index.njk',
    // Ignore account header becuase extend layout kills it
    '!./src/hmrc-design-patterns/account-header/*/index.njk'
  ])
    .pipe(concat('index.njk'))
    // Remove all tags except first
    .pipe(replace(/---(\s*)((.|\s)+?)(\s*)---/gm, (match) => {
      const replacement = isFirstMatch ? match : ''
      isFirstMatch = false
      return replacement
    }))
    .pipe(gulp.dest('./src/examples'))
    .on('end', done)
})

gulp.task('compile', (done) => {
  util.log('Metalsmith build starting')

  Metalsmith(projectRoot)
    .use(ignore(['**/__tests__/*', 'all-patterns/*']))
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
        filters,
        globals
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

gulp.task('build:watch', (done) => {
  templatePaths.forEach(pathStr => {
    gulp.watch(path.join(pathStr, pattern), gulp.parallel('build'))
  })

  gulp.watch(pathFromRoot('application', 'assets', 'javascripts', '**', '*'), gulp.parallel('build'))
  done()
})
