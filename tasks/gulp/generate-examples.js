const gulp = require('gulp')
const del = require('del')
const concat = require('gulp-concat')
const replace = require('gulp-replace')

const pathFromRoot = require('../../util/pathFromRoot')

const njkTagRegEx = /---(\s*)((.|\s)+?)(\s*)---/gm

const entryPoint = './src/all-patterns/index.njk'

const rootPath = pathFromRoot('src', 'examples')

const layouts = [
  `${rootPath}/account-header/*/index.njk`
]

gulp.task('scrape-patterns', (done) => {
  let isFirstMatch = true
  gulp.src([
    entryPoint,
    // All pattern examples
    `${rootPath}/*/*/index.njk`,
    ...layouts.map(layout => `!${layout}`)
  ])
    .pipe(concat('patterns.njk'))
    // Remove all tags except first
    .pipe(replace(njkTagRegEx, (match) => {
      const replacement = isFirstMatch ? match : ''
      isFirstMatch = false
      return replacement
    }))
    .pipe(gulp.dest(rootPath))
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
    .pipe(gulp.dest(rootPath))
    .on('end', done)
})

gulp.task('prepare', async (done) => {
  await del(pathFromRoot(rootPath, '*.njk'))
  done()
})

// Temporarily disabling patterns.html/layouts.html to fix DS working on Apple Silicon devices
// gulp.task('generate-examples', gulp.series('prepare', gulp.parallel('scrape-patterns', 'scrape-layouts')))
gulp.task('generate-examples', gulp.series('prepare'))
