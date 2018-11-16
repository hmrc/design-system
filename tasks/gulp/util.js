const path = require('path')

module.exports = {
  pathFromRoot: (...args) => path.join(process.cwd(), ...args)
}
