const gulp = require('gulp')
const webserver = require('gulp-webserver')
const pathFromRoot = require('./util').pathFromRoot

gulp.task('serve', () => {
  gulp.src(pathFromRoot('dist'))
    .pipe(webserver({
      livereload: true,
      open: false,
      middleware: (req, res, next) => {
        if (req.url === '/') {
          res.writeHead(302, { location: '/index.html' })
          res.end()
        } else {
          next()
        }
      }
    }))
})