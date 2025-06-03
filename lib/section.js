const path = require('path')
let sectionTitle

module.exports = ({
  property = 'section',
  titleProperty = 'sectionTitle'
} = {}) => (files, _, done) => {
  setImmediate(done)

  Object.keys(files).forEach(file => {
    const sections = (path.dirname(file).split('/') || [])

    sectionTitle = files[sections[0] + '/index.njk']?.title

    files[file][property] = sections[0] ? sections[0] : ''
    files[file][titleProperty] = sectionTitle
  })
}
