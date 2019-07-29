const fs = require('fs')

const pathFromRoot = require('../util/pathFromRoot')
const packageJson = require('../package.json')

const getDependencyConfigPath = dependencyName => pathFromRoot('node_modules', dependencyName, 'govuk-prototype-kit.config.json')
const exists = dependencyName => fs.existsSync(getDependencyConfigPath(dependencyName))

const readExtensionConfigSync = keyName => [].concat(
  ...Object.keys(packageJson.dependencies)
  .filter(exists)
  .map(dependencyName => (require(getDependencyConfigPath(dependencyName))[keyName] || [])
    .map(item => ({module: dependencyName, item}))
  )
)

module.exports = readExtensionConfigSync
