/* globals describe it expect */

const { JSDOM } = require('jsdom')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

const filters = require('../../lib/filters')
const globals = require('../../lib/globals')
const templatePaths = require('../../lib/templatePaths')

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals
}

const templateFactory = (parameters) =>
`{%- from "_codeSnippet.njk"  import codeSnippet with context-%}
{{ codeSnippet(${JSON.stringify(parameters)})
}}`.toString()

const documentFactory = function (parameters, options) {
  const document = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="codeSnippetContainer"></div></body></html>',
    { contentType: 'text/html' }
  ).window.document
  const exampleContainer = document.getElementById('codeSnippetContainer')
  const templateString = templateFactory(parameters)
  exampleContainer.innerHTML = nunjucks.render(templateString, options).body
  return document
}

describe('Design pattern page', () => {
  const parameters = { code: 'foo' }
  const document = documentFactory(parameters, options)

  it('should render the code inside <pre> and <code> elements', () => {
    const code = document.querySelector('pre code')
    expect(code.innerHTML).toBe('foo')
  })

  describe('Copy functionality', () => {

    it('should not display the `copy` button when the canCopy flag is false or null', () => {
      const copy = document.querySelector('.app-link--copy')
      expect(copy).toBeNull()
    })

    it('should not add the `app-code-snippet--copy` class to the container when the canCopy flag is false or null', () => {
      const container = document.querySelector('.app-code-snippet')
      expect(container.className.includes('app-code-snippet--copy')).toBeFalsy()
    })

    it('should display the `copy` button when the canCopy flag is true', () => {
      const document = documentFactory({ ...parameters, canCopy: true }, options)
      const copy = document.querySelector('.app-link--copy')
      expect(copy).not.toBeNull()
    })

    it('should add the `app-code-snippet--copy` class to the container when the canCopy flag is true', () => {
      const document = documentFactory({ ...parameters, canCopy: true }, options)
      const container = document.querySelector('.app-code-snippet')
      expect(container.className.includes('app-code-snippet--copy')).toBeTruthy()
    })

  })
})
