const path = require('path')

module.exports = {
  pathFromRoot: (...args) => path.join(__dirname, '..', '..', ...args)
}
