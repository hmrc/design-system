const path = require('path')

module.exports = {
  is_array: function (obj) { return Array.isArray(obj) },
  getDirectoryFromFilepath: function (filepath) { return path.dirname(filepath) }
}
