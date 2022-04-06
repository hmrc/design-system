/* globals describe it expect */

const { JSDOM } = require('jsdom')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

const filters = require('../../lib/filters')
const globals = require('../../lib/globals')
const templatePaths = require('../../lib/templatePaths')

const titleSuffix = 'Design resources for HMRC – GOV.UK'
const defaultTitle = 'Default heading'
const defaultSection = 'HMRC Design Patterns'

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals,
  title: defaultTitle,
  sectionTitle: defaultSection
}

const templateFactory = () => `{% include 'twoColumnPage.njk' %}`.toString()

const documentFactory = (params) => {
  const templateString = templateFactory()
  const html = nunjucks.render(templateString, { ...options, ...params}).body
  return new JSDOM(html).window.document
}

describe('Design pattern page', () => {
  const document = documentFactory()
  const heading = document.querySelector('h1.govuk-heading-xl')

  it('should render some HTML', () => {
    expect(document.body).not.toBeNull()
  })

  describe('Document title build', () => {
    it('should use the title arg, sectionTitle default and suffix by default', () => {
      expect(document.title).toBe(`${defaultTitle} - ${defaultSection} - ${titleSuffix}`)
    })

    it('should not use the `sectionTitle` arg if it is the same as the title', () => {
      const title = defaultSection
      const document = documentFactory({ title })
      expect(document.title).toBe(`${defaultSection} - ${titleSuffix}`)
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

  describe('Phase banner', () => {
    let phaseBanner

    beforeEach(() => {
      const document = documentFactory({ status: 'experimental' })
      phaseBanner = document.querySelector('.hmrc-phase-banner')
    })

    it('should display the phase banner, with the correct text, when the status flag is set', () => {
      expect(phaseBanner).not.toBeNull()
      expect(phaseBanner.querySelector('strong').innerHTML).toBe('<span class=\"govuk-visually-hidden\">This pattern is&nbsp;</span>experimental')
    })

    it('should render the default status text if the statusText flag is not set', () => {
      const expectedString = 'This is currently experimental because <a class="govuk-link" href="#research">more research</a> is needed.'
      expect(phaseBanner.querySelector('p').innerHTML).toBe(expectedString)
    })

    it('should render the passed status text if the statusText flag is set', () => {
      const document = documentFactory({ status: 'experimental', statusText: 'Some status text' })
      phaseBanner = document.querySelector('.hmrc-phase-banner')
      expect(phaseBanner.querySelector('p').textContent).toBe('Some status text')
    })
  })

  it('should render content from the `contents` arg', () => {
    const document = documentFactory({ contents: '<p id="someContent">foo</p>' })
    const content = document.querySelector('#someContent')

    expect(content).not.toBeNull()
    expect(content.textContent).toBe('foo')
  })
})
