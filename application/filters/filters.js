const filters = {}
const path = require('path')

filters.isArray = function isArray (obj) { return Array.isArray(obj) }
filters.getDirectoryFromFilepath = function getDirectoryFromFilepath (filepath) { return path.dirname(filepath) }

module.exports = filters
