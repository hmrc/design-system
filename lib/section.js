const path = require('path')

module.exports = ({
  property = 'section'
} = {}) => (files, _, done) => {
  setImmediate(done)

  Object.keys(files).forEach(file => {
    const section = (path.dirname(file).split('/') || [])[0]
    files[file][property] = section ? section : ''
  })
}
