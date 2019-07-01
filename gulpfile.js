const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')

require('./tasks/gulp/build')
require('./tasks/gulp/clean')
require('./tasks/gulp/copy-assets')
require('./tasks/gulp/lint')
require('./tasks/gulp/sass')
require('./tasks/gulp/serve')
require('./tasks/gulp/jest')

gulp.task('watch', ['build:watch', 'scss:watch', 'copy-assets:watch'])

gulp.task('build', ['clean', 'compile', 'scss:compile', 'copy-assets'])

gulp.task('test', ['lint', 'test:unit'])

gulp.task('default', gulpSequence('build', ['watch', 'serve']))
