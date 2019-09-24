const path = require('path')
let sectionTitle

module.exports = ({
  property = 'section',
  titleProperty = 'sectionTitle'
} = {}) => (files, _, done) => {
  setImmediate(done)

  Object.keys(files).forEach(file => {
    const sections = (path.dirname(file).split('/') || [])
    // Given we can make assumptions about the directory structure is this reliable?
    if (sections.length === 1) {
      sectionTitle = files[file].title
    }
    files[file][property] = sections[0] ? sections[0] : ''
    files[file][titleProperty] = sectionTitle
  })
}
