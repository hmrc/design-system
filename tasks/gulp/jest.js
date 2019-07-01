const gulp = require('gulp')
const jest = require('gulp-jest').default

gulp.task('test:unit', () => gulp.src('.').pipe(jest({

})))
