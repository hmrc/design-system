const fs = require('fs')
const pathFromRoot = require('./pathFromRoot')
const getConfigFileName = depName => pathFromRoot('node_modules', depName, 'govuk-prototype-kit.config.json')
const exists = filePath => fs.existsSync(filePath)

const readExtensionConfigSync = keyName => [].concat(...Object.keys(require(pathFromRoot('package.json')).dependencies).filter(depName => exists(getConfigFileName(depName))).map(depName => (require(getConfigFileName(depName))[keyName] || []).map(item => ({module: depName, item}))))

module.exports = {readExtensionConfigSync}
