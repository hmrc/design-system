const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')

require('./tasks/gulp/clean')
require('./tasks/gulp/build')
require('./tasks/gulp/sass')
require('./tasks/gulp/lint')
require('./tasks/gulp/jest')
require('./tasks/gulp/copy-assets')
require('./tasks/gulp/serve')

gulp.task('watch', gulp.parallel('build:watch', 'scss:watch', 'copy-assets:watch'))

gulp.task('build', gulp.parallel('clean', 'compile', 'scss:compile', 'copy-assets'))

gulp.task('integration', gulp.series('build', 'serve:integration', 'jest:integration'))

gulp.task('test', gulp.parallel('lint', 'jest:unit', 'integration'))

gulp.task('default', gulp.series('build', 'watch', 'serve'))
