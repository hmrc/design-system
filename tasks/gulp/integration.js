const gulp = require('gulp')
const connect = require('gulp-connect')
const jest = require('gulp-jest').default

const pathFromRoot = require('../../util/pathFromRoot')
const integrationTestPort = process.env.INTEGRATION_PORT || process.env.integration_port || 3000

gulp.task('integration:server', () => {
  connect.server({
    root: pathFromRoot('dist'),
    port: integrationTestPort
  })
})

gulp.task('integration:test', () => {
  process.env.NODE_ENV = 'test'
  gulp.src('.').pipe(jest({
  // return gulp.src('**/__tests__/**/*.integration.js').pipe(jest({
    "preprocessorIgnorePatterns": [
      "<rootDir>/dist/", "<rootDir>/node_modules/"
    ],
    "testMatch": "**/__tests__/**/*.integration.js",
    "preset": "jest-puppeteer",
    "automock": false
  }))
  .on('finish', () => {
    connect.serverClose()
  })
})
