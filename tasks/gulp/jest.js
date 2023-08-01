const gulp = require('gulp')
const connect = require('gulp-connect')

const jest = require('@jest/core')

const jestConfig = {
  projects: [__dirname],
  preprocessorIgnorePatterns: [
    '<rootDir>/dist/', '<rootDir>/node_modules/'
  ],
  automock: false
}

const throwErrorOnFail = ({ success }) => !success && new Error('tests failed, exiting')

gulp.task('jest:unit', (done) => {
  const requestedToUpdateSnapshots = process.argv.includes('-u')
  const isSafeToUpdateSnapshots = process.argv.includes('jest:unit')
  if (requestedToUpdateSnapshots && !isSafeToUpdateSnapshots) {
    done(new Error('To update snapshots please run npm run test:unit -- -u'))
    return
  }

  jest.runCLI({
    ...jestConfig,
    updateSnapshot: requestedToUpdateSnapshots && isSafeToUpdateSnapshots,
    testMatch: ['**/__tests__/**/*.test.js']
  }, jestConfig.projects).then(({ results }) => done(throwErrorOnFail(results))).catch(error => done(error))
})

gulp.task('jest:integration', (done) => {
  jest.runCLI({
    ...jestConfig,
    testMatch: ['**/__tests__/**/*.integration.js'],
    preset: 'jest-puppeteer'
  }, jestConfig.projects).then(({ results }) => {
    connect.serverClose()
    done(throwErrorOnFail(results))
  }).catch(error => done(error))
})

gulp.task('jest:unit:watch', gulp.series('jest:unit', (done) => {
  gulp.watch('**/*.test.js', gulp.parallel('jest:unit'))
  done()
}))
