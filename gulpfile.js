const gulp = require('gulp')

require('./tasks/gulp/sass')

gulp.task('default', ['scss:compile'])