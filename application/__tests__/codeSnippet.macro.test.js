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
})
