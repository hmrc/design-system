const path = require('path')

module.exports = (...args) => path.join(process.cwd(), ...args)
