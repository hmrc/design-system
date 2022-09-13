/* globals describe it expect afterEach beforeEach */

const navigation = require('../navigation')

describe('Navigation metalsmith plugin', () => {

  const navModel = {}
  const metalsmithMock = {
    metadata: jest.fn(() => navModel)
  }

  beforeEach(() => {
    Object.keys(navModel).forEach(key => { delete navModel[key] })
  })

  afterEach(jest.clearAllMocks)

  it('should add an object of unique patterns to metalsmith metadata', (done) => {
    const files = {
      'section1/test-pattern/index.html': {
        contents: Buffer.from('test pattern index page'),
        mode: '0644',
        stats: {},
        filepath: 'section1/test-pattern/index.njk'
      },
      'section1/test-pattern/default/index.html': {
        contents: Buffer.from('test default pattern'),
        mode: '0644',
        stats: {},
        filepath: 'section1/test-pattern/default/index.njk'
      },
      'section1/test-pattern/variant/index.html': {
        contents: Buffer.from('test pattern variant'),
        mode: '0644',
        stats: {},
        filepath: 'section1/test-pattern/variant/index.njk'
      },
      'section1/test-pattern-with-more-words/index.html': {
        contents: Buffer.from('test pattern with more words index page'),
        mode: '0644',
        stats: {},
        filepath: 'section1/test-pattern-with-more-words/index.njk'
      },
      'section2/testing/index.html': {
        contents: Buffer.from('test different section'),
        mode: '0644',
        stats: {},
        filepath: 'section2/testing/index.njk'
      },
      'section1/test-pattern-with-custom-text/index.html': {
        contents: Buffer.from('test pattern with custom navigation text'),
        mode: '0644',
        stats: {},
        filepath: 'section1/test-pattern-with-custom-text/index.njk',
        menuText: 'Custom text!'
      },
      'section1/aardvark/index.html': {
        contents: Buffer.from('test for ordering alphabetically by text value'),
        mode: '0644',
        stats: {},
        filepath: 'section1/aardvark/index.njk',
        menuText: 'Zebra'
      },
      'section1/test-pattern/with-additional-segment/index.html': {
        contents: Buffer.from('test pattern with additional directory segment'),
        mode: '0644',
        stats: {},
        filepath: 'section1/test-pattern/with-additional-segment/index.njk'
      },
      'section1/archived-test-pattern/index.html': {
        contents: Buffer.from('test pattern with archived status'),
        mode: '0644',
        stats: {},
        filepath: 'section1/archived-test-pattern/index.njk',
        status: 'archived'
      },
      'section1/development-test-pattern/index.html': {
        contents: Buffer.from('test pattern with development status'),
        mode: '0644',
        stats: {},
        filepath: 'section1/development-test-pattern/index.njk',
        status: 'development'
      },
      'section1/secondary-navigation-item/index.html': {
        contents: Buffer.from('test pattern in secondary navigation position'),
        mode: '0644',
        stats: {},
        filepath: 'section1/secondary-navigation-item/index.njk',
        navigationPlacement: 'secondary'
      },
      'section1/hidden-item/index.html': {
        contents: Buffer.from('test pattern hidden from menu'),
        mode: '0644',
        stats: {},
        filepath: 'section1/hidden-item/index.njk',
        navigationPlacement: 'none'
      }
    }
    const expected = {
      navigation: [
        {
          title: 'section1',
          items: [
            {
              filepath: 'section1/test-pattern-with-custom-text',
              href: 'section1/test-pattern-with-custom-text',
              placement: 'primary',
              text: 'Custom text!'
            },
            {
              filepath: 'section1/secondary-navigation-item',
              href: 'section1/secondary-navigation-item',
              placement: 'secondary',
              text: 'Secondary navigation item'
            },
            {
              filepath: 'section1/test-pattern',
              href: 'section1/test-pattern',
              placement: 'primary',
              text: 'Test pattern'
            },
            {
              filepath: 'section1/test-pattern-with-more-words',
              href: 'section1/test-pattern-with-more-words',
              placement: 'primary',
              text: 'Test pattern with more words'
            },
            {
              filepath: 'section1/aardvark',
              href: 'section1/aardvark',
              placement: 'primary',
              text: 'Zebra'
            }
          ]
        },
        {
          title: 'section2',
          items: [
            {
              filepath: 'section2/testing',
              href: 'section2/testing',
              placement: 'primary',
              text: 'Testing'
            }
          ]
        }
      ]
    }

    const filesBefore = JSON.parse(JSON.stringify(files))

    navigation()(files, metalsmithMock, function (err) {
      expect(JSON.stringify(filesBefore)).toEqual(JSON.stringify(files))
      expect(navModel).toEqual(expected)
      expect(err).toBeNull()
      done()
    })
  })
})
