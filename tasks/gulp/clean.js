const gulp = require('gulp')
const del = require('del')
const pathFromRoot = require('../../util/pathFromRoot')

gulp.task('clean', () => del(pathFromRoot('dist/')))
