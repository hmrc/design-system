const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')

require('./tasks/gulp/clean')
require('./tasks/gulp/build')
require('./tasks/gulp/sass')
require('./tasks/gulp/copy-assets')
require('./tasks/gulp/serve')

gulp.task('watch:all', ['build:watch', 'scss:watch'])

gulp.task('build:full', ['clean', 'build', 'scss:compile', 'copy-assets'])

gulp.task('default', gulpSequence('build:full', ['watch:all', 'serve']))
