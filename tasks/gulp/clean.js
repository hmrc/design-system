const gulp = require('gulp')
const del = require('del')
const path = require('path')

const projectRoot = path.join(__dirname, '..', '..')

gulp.task('clean', () => del.sync([
  path.join(projectRoot, 'dist', '/**/*')
]))
