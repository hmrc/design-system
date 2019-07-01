const gulp = require('gulp')
const connect = require('gulp-connect')
const jest = require('gulp-jest').default

const preprocessorIgnorePatterns = [
  '<rootDir>/dist/', '<rootDir>/node_modules/'
]

gulp.task('jest:unit', () => gulp.src('.').pipe(jest({
  preprocessorIgnorePatterns,
  'testMatch': '**/__tests__/**/*.test.js',
  'automock': false
})))

gulp.task('jest:integration', () => {
  process.env.NODE_ENV = 'test'
  gulp.src('.').pipe(jest({
    preprocessorIgnorePatterns,
    'testMatch': '**/__tests__/**/*.integration.js',
    'preset': 'jest-puppeteer',
    'automock': false
  })).on('finish', () => {
    connect.serverClose()
  })
})

gulp.task('jest:unit:watch', () => gulp.watch(['**/*.test.js'], ['jest:unit']))
