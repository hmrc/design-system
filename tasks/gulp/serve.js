const gulp = require('gulp')
const connect = require('gulp-connect')

const pathFromRoot = require('../../util/pathFromRoot')
const { integrationTestPort } = require('../../constants')

gulp.task('serve:heroku', (done) => {
  connect.server({
    root: pathFromRoot('dist'),
    host: '0.0.0.0',
    port: process.env.PORT || process.env.port || 3000
  })
  done()
})

gulp.task('serve', (done) => {
  connect.server({
    root: pathFromRoot('dist'),
    port: process.env.PORT || process.env.port || 3000,
    livereload: true
  })
  done()
})

gulp.task('serve:integration', (done) => {
  connect.server({
    root: pathFromRoot('dist'),
    port: integrationTestPort
  })
  done()
})
