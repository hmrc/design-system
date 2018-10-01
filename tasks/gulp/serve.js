const gulp = require('gulp')
const { execSync } = require('child_process')

gulp.task('serve', () => {
  execSync('./node_modules/.bin/http-server ./dist -a 127.0.0.1 -p 3000')
})
