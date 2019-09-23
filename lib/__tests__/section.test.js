/* globals describe it expect */

const section = require('../section')

describe('Section metalsmith plugin', () => {
  it('should add a section property to the metadata of each file', async (done) => {
    const files = {
      'section/subsection/file.html': {
        filepath: 'section/subsection/file.html'
      }
    }
    const expected = {
      'section/subsection/file.html': {
        filepath: 'section/subsection/file.html',
        section: 'section'
      }
    }

    section()(files, null, () => {
      expect(files).toEqual(expected)
      done()
    })
  })
})
