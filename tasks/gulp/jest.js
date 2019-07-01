const gulp = require('gulp')
const jest = require('gulp-jest').default

gulp.task('jest:unit', () => gulp.src('.').pipe(jest({

})))

gulp.task('jest:watch', () => gulp.watch(['**/*.test.js'], ['jest:unit']))
