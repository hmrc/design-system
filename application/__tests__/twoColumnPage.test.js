/* globals describe it expect */

const { JSDOM } = require('jsdom')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

const filters = require('../../lib/filters')
const globals = require('../../lib/globals')
const templatePaths = require('../../lib/templatePaths')


const titleSuffix = 'Design resources for HMRC – GOV.UK'
const defaultTitle = 'Default heading'

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals,
  title: defaultTitle
}


const templateFactory = () => `{% include 'twoColumnPage.njk' %}`.toString()

const documentFactory = (params) => {
  const templateString = templateFactory()
  const html = nunjucks.render(templateString, { ...options, ...params}).body
  return new JSDOM(html).window.document
}

describe('Two column page layout', () => {
  const document = documentFactory()
  const heading = document.querySelector('h1.govuk-heading-xl')

  it('should render some HTML', () => {
    expect(document.body).not.toBeNull()
  })

  describe('Document title build', () => {
    it('should use the title arg and suffix by default', () => {
      expect(document.title).toBe(`${defaultTitle} - ${titleSuffix}`)
    })

    it('should incorporate the `section` arg if present', () => {
      const section = 'A section'
      const document = documentFactory({ section })
      expect(document.title).toBe(`${defaultTitle} - ${section} - ${titleSuffix}`)
    })
  })

  describe('Page heading', () => {
    it('should use the title arg by default', () => {
      expect(heading.textContent).toBe('Default heading')
    })

    it('should use the `pageHeading` arg if it is present', () => {
      const document = documentFactory({ pageHeading: 'A different heading' })
      const heading = document.querySelector('h1.govuk-heading-xl')
      expect(heading.textContent).toBe('A different heading')
    })
  })

  it('should render content from the `contents` arg', () => {
    const document = documentFactory({ contents: '<p id="someContent">foo</p>' })
    const content = document.querySelector('#someContent')

    expect(content).not.toBeNull()
    expect(content.textContent).toBe('foo')
  })
})


