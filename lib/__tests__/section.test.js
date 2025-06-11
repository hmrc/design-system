/* globals describe it expect */

const section = require('../section')

describe('Section metalsmith plugin', () => {
  it('should add a section property to the metadata of each file', (done) => {
    const files = {
      'section/index.njk': {
        title: 'I am a section title'
      },
      'section/subsection/file.html': {
        title: 'I am not a section title'
      },
      'another-section/index.njk': {
        title: 'I am another section title'
      },
      'another-section/subsection/file.html': {
        title: 'I am not another section title'
      }
    }
    const expected = {
      'section/index.njk': {
        section: 'section',
        sectionTitle: 'I am a section title',
        title: 'I am a section title'
      },
      'section/subsection/file.html': {
        section: 'section',
        sectionTitle: 'I am a section title',
        title: 'I am not a section title'
      },
      'another-section/index.njk': {
        section: 'another-section',
        sectionTitle: 'I am another section title',
        title: 'I am another section title'
      },
      'another-section/subsection/file.html': {
        section: 'another-section',
        sectionTitle: 'I am another section title',
        title: 'I am not another section title'
      }
    }

    section()(files, null, () => {
      expect(files).toEqual(expected)
      done()
    })
  })
})
