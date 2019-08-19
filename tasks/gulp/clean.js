const gulp = require('gulp')
const del = require('del')
const pathFromRoot = require('../../util/pathFromRoot')

gulp.task('clean', async (done) => {
  await del(pathFromRoot('dist/'))
  await del(pathFromRoot('src', 'examples'))
  done()
})
