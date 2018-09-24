const gulp = require('gulp')

gulp.task('copy-assets', ()=>{
  // todo use path.join() for these paths everywhere
  return gulp.src('./node_modules/govuk-frontend/assets/**/*')
    .pipe(gulp.dest('./dist/assets'))
})