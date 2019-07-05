const path = require('path')
const highlight = require('./highlighter')

module.exports = {
  is_array: obj => Array.isArray(obj),
  dirname: filepath => path.dirname(filepath),
  highlight
}
