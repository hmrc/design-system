const path = require('path')

module.exports = {
  isArray: function (obj) { return Array.isArray(obj) },
  getDirectoryFromFilepath: function (filepath) { return path.dirname(filepath) }
}
