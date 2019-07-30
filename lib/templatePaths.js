const pathFromRoot = require('../util/pathFromRoot')
const packageJson = require('../package.json')

const flatten = arr => [].concat(...arr) // polyfill

const pathsDetectedFromExtensions = flatten(Object.keys(packageJson.dependencies).map(packageName => {
  try {
    const packageConfig = require(pathFromRoot('node_modules', packageName, 'govuk-prototype-kit.config.json'))
    return packageConfig.nunjucksPaths.map(nunjucksPath => pathFromRoot('node_modules', packageName, nunjucksPath))
  } catch (e) {
    return []
  }
}))

module.exports = pathsDetectedFromExtensions.concat([
  pathFromRoot('lib', 'template-hacks'),
  pathFromRoot('application', 'templates'),
  pathFromRoot('application', 'templates', 'partials'),
  pathFromRoot('src'),
])
