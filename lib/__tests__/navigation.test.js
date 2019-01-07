/* globals jest describe test expect */

const navigation = require('../navigaiton')

const metalsmithMock = {
  metadata: jest.fn(() => ({}))
}

const doneMock = jest.fn()

afterEach(jest.clearAllMocks)

describe('Navigation metalsmith plugin', () => {
  test('should add an object of unique patterns to metalsmith metadata', () => {
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
      'another/testing/index.html': {
        contents: Buffer.from('test different section'),
        mode: '0644',
        stats: {},
        filepath: 'another/testing/index.njk'
      }
    }

    const filesBefore = JSON.parse(JSON.stringify(files))

    navigation()(files, metalsmithMock, doneMock)

    const result = {
      navigation: [
        {
          section: 'test',
          text: 'Test pattern',
          href: 'test/test-pattern',
          filepath: 'test/test-pattern/index.html'
        },
        {
          section: 'another',
          text: 'Testing',
          href: 'another/testing',
          filepath: 'another/testing/index.html'
        }
      ]
    }

    expect(JSON.stringify(filesBefore)).toEqual(JSON.stringify(files))
    expect(metalsmithMock.metadata).toHaveReturnedWith(result)
    expect(doneMock).toHaveBeenCalled()
  })
})
