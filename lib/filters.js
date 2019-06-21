const path = require('path')
const highlight = require('./highlighter')

module.exports = {
  is_array: function (obj) { return Array.isArray(obj) },
  dirname: function (filepath) { return path.dirname(filepath) },
  highlight
}
