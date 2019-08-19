const gulp = require('gulp')
const concat = require('gulp-concat')
const replace = require('gulp-replace')

const njkTagRegEx = /---(\s*)((.|\s)+?)(\s*)---/gm

const entryPoint = './src/all-patterns/index.njk'

const ignoreFiles = [
  '!./src/hmrc-design-patterns/hmrc-design-patterns-backlog/*/index.njk',
  '!./src/hmrc-design-patterns/install-hmrc-frontend-in-your-prototype/*/index.njk',
  '!./src/hmrc-design-patterns/updating-hmrc-frontend-in-your-prototype/*/index.njk'
]

const layouts = [
  './src/hmrc-design-patterns/account-header/*/index.njk'
]

const destination = './src/examples'

gulp.task('scrape-patterns', (done) => {
  let isFirstMatch = true
  gulp.src([
    entryPoint,
    // All pattern examples
    './src/hmrc-design-patterns/*/*/index.njk',
    // Ignore others
    ...ignoreFiles,
    ...layouts.map(layout => `!${layout}`)
  ])
    .pipe(concat('patterns.njk'))
    // Remove all tags except first
    .pipe(replace(njkTagRegEx, (match) => {
      const replacement = isFirstMatch ? match : ''
      isFirstMatch = false
      return replacement
    }))
    .pipe(gulp.dest(destination))
    .on('end', done)
})

gulp.task('scrape-layouts', (done) => {
  let isFirstMatch = true
  gulp.src([
    entryPoint,
    ...layouts
  ])
    .pipe(concat('layouts.njk'))
    // Remove all tags except first
    .pipe(replace(njkTagRegEx, (match) => {
      const replacement = isFirstMatch ? match : ''
      isFirstMatch = false
      return replacement
    }))
    .pipe(gulp.dest(destination))
    .on('end', done)
})

gulp.task('generate-examples', gulp.parallel('scrape-patterns', 'scrape-layouts'))
