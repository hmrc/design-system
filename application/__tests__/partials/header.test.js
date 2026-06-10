/* globals describe it expect */

const { JSDOM } = require('jsdom')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

const filters = require('../../../lib/filters')
const globals = require('../../../lib/globals')
const templatePaths = require('../../../lib/templatePaths')

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals
}

const templateFactory = () => `{% include 'header.njk' %}`.toString()

const documentFactory = (params) => {
  const templateString = templateFactory()
  const html = nunjucks.render(templateString, { ...options, ...params}).body
  return new JSDOM(html).window.document
}

describe('Header partial', () => {
  const document = documentFactory()
  const internalHeader = document.querySelector('header.hmrc-internal-header')

  it('should render some HTML', () => {
    expect(document.body).not.toBeNull()
  })
})
