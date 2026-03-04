const gulp = require('gulp')
const del = require('del')
const concat = require('gulp-concat')
const replace = require('gulp-replace')

const pathFromRoot = require('../../util/pathFromRoot')

const njkTagRegEx = /---(\s*)((.|\s)+?)(\s*)---/gm

const entryPoint = './src/all-patterns/index.njk'

const rootPath = pathFromRoot('src', 'examples')

gulp.task('scrape-patterns', (done) => {
  let isFirstMatch = true
  gulp.src([
    entryPoint,
    // All pattern examples
    `${rootPath}/*/*/index.njk`
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
  gulp.src([entryPoint])
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
// Make sure to remove src/examples/layouts.njk & src/examples/patterns.njk
// gulp.task('generate-examples', gulp.series('prepare', gulp.parallel('scrape-patterns', 'scrape-layouts')))
gulp.task('generate-examples', gulp.series('prepare'))
