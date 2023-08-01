/* globals describe it beforeEach expect page  */

const { analyzeAccessibility } = require('../../../lib/accessibility')

const { integrationTestPort } = require('../../../constants')
const visit = (path) => page.goto(`http://localhost:${integrationTestPort}${path}`)

describe('HMRC content style guide', () => {
  beforeEach(async () => {
    await visit('/hmrc-content-style-guide/')
  })

  it('should not have accessibility issues', async () => {
      const accessibilityReport = await analyzeAccessibility(page);
      expect(accessibilityReport).toHaveNoAccessibilityIssues();
  })

  it('should have the correct meta title', async () => {
    const title = await page.title()
    expect(title).toBe('HMRC content style guide - Design resources for HMRC — GOV.UK')
  })

  it('should have the correct page heading', async () => {
    const heading = await page.$eval('h1', el => el.textContent)
    expect(heading).toBe('HMRC content style guide')
  })

  describe('Accordion', () => {
    it('should display an accordion', async () => {
      const accordion = await page.$eval('.govuk-accordion', el => !!el)
      expect(accordion).toBeTruthy()
    })

    it('should open relevant section when an anchor is clicked', async () => {
      let testSectionClasses = await page.$$eval('.govuk-accordion__section', el => el[2].className )
      expect(testSectionClasses).not.toContain('govuk-accordion__section--expanded')
      await page.click('button[aria-controls="accordion-default-content-20"]')
      await page.$eval('#accordion-default-content-20', el => el.querySelectorAll('.govuk-link')[0].click())
      testSectionClasses = await page.$$eval('.govuk-accordion__section', el => el[2].className )
      expect(testSectionClasses).toContain('govuk-accordion__section--expanded')
      expect(page.url()).toContain('#capitalisation-of-taxes')
    })

    it('should not close relevant section when an anchor is clicked if it is already open', async () => {
      // Already open from previous test
      let testSectionClasses = await page.$$eval('.govuk-accordion__section', el => el[2].className )
      expect(testSectionClasses).toContain('govuk-accordion__section--expanded')
      await page.$eval('#accordion-default-content-20', el => el.querySelectorAll('.govuk-link')[0].click())
      expect(testSectionClasses).toContain('govuk-accordion__section--expanded')
      expect(page.url()).toContain('#capitalisation-of-taxes')
    })
  })

})
