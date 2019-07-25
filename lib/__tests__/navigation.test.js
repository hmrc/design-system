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

  it('should add an object of unique patterns to metalsmith metadata', async (done) => {
    const files = {
      'test/test-pattern/index.html': {
        contents: Buffer.from('test pattern index page'),
        mode: '0644',
        stats: {},
        filepath: 'test/test-pattern/index.njk'
      },
      'test/test-pattern/default/index.html': {
        contents: Buffer.from('test default pattern'),
        mode: '0644',
        stats: {},
        filepath: 'test/test-pattern/default/index.njk'
      },
      'test/test-pattern/variant/index.html': {
        contents: Buffer.from('test pattern variant'),
        mode: '0644',
        stats: {},
        filepath: 'test/test-pattern/variant/index.njk'
      },
      'test/test-pattern-with-more-words/index.html': {
        contents: Buffer.from('test pattern with more words index page'),
        mode: '0644',
        stats: {},
        filepath: 'test/test-pattern-with-more-words/index.njk'
      },
      'another/testing/index.html': {
        contents: Buffer.from('test different section'),
        mode: '0644',
        stats: {},
        filepath: 'another/testing/index.njk'
      },
      'test/test-pattern-with-custom-text/index.html': {
        contents: Buffer.from('test pattern with custom navigation text'),
        mode: '0644',
        stats: {},
        filepath: 'test/test-pattern-with-custom-text/index.njk',
        menuText: 'Custom text!'
      },
      'test/aardvark/index.html': {
        contents: Buffer.from('test for ordering alphabetically by text value'),
        mode: '0644',
        stats: {},
        filepath: 'test/aardvark/index.njk',
        menuText: 'Zebra'
      },
      'test/test-pattern/with-additional-segment/index.html': {
        contents: Buffer.from('test pattern with additional directory segment'),
        mode: '0644',
        stats: {},
        filepath: 'test/test-pattern/with-additional-segment/index.njk'
      },
      'test/development-test-pattern/index.html': {
        contents: Buffer.from('test pattern with development status'),
        mode: '0644',
        stats: {},
        filepath: 'test/development-test-pattern/index.njk',
        status: 'development'
      },
      'test/secondary-navigation-item/index.html': {
        contents: Buffer.from('test pattern in secondary navigation position'),
        mode: '0644',
        stats: {},
        filepath: 'test/secondary-navigation-item/index.njk',
        navigationPlacement: 'secondary'
      },
      'test/hidden-item/index.html': {
        contents: Buffer.from('test pattern hidden from menu'),
        mode: '0644',
        stats: {},
        filepath: 'test/hidden-item/index.njk',
        navigationPlacement: 'none'
      }
    }
    const expected = {
      navigation: [
        {
          filepath: 'test/test-pattern-with-custom-text/index.html',
          href: 'test/test-pattern-with-custom-text',
          placement: 'primary',
          section: 'test',
          text: 'Custom text!'
        },
        {
          filepath: 'test/secondary-navigation-item/index.html',
          href: 'test/secondary-navigation-item',
          placement: 'secondary',
          section: 'test',
          text: 'Secondary navigation item'
        },
        {
          filepath: 'test/test-pattern/index.html',
          href: 'test/test-pattern',
          placement: 'primary',
          section: 'test',
          text: 'Test pattern'
        },
        {
          filepath: 'test/test-pattern-with-more-words/index.html',
          href: 'test/test-pattern-with-more-words',
          placement: 'primary',
          section: 'test',
          text: 'Test pattern with more words'
        },
        {
          filepath: 'another/testing/index.html',
          href: 'another/testing',
          placement: 'primary',
          section: 'another',
          text: 'Testing'
        },
        {
          filepath: 'test/aardvark/index.html',
          href: 'test/aardvark',
          placement: 'primary',
          section: 'test',
          text: 'Zebra'
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
