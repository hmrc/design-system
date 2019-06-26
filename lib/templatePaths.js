const pathFromRoot = require('../util/pathFromRoot')

module.exports = [
  pathFromRoot('node_modules', 'hmrc-frontend', 'components'),
  pathFromRoot('application', 'templates'),
  pathFromRoot('application', 'templates', 'partials'),
  pathFromRoot('src'),
]
