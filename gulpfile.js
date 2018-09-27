const gulp = require('gulp')
const { execSync } = require('child_process')

require('./tasks/gulp/build')
require('./tasks/gulp/sass')
require('./tasks/gulp/copy-assets')
require('./tasks/gulp/serve')

gulp.task('default', ['clean', 'build', 'scss:compile', 'copy-assets'], () => {
  console.log('Serving content at http://localhost:3000/ ... press ctrl c to exit.')
  execSync('./node_modules/.bin/http-server ./dist -a 127.0.0.1 -p 3000')
})
