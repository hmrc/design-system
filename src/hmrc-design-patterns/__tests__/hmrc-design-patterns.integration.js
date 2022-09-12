/* globals describe it beforeEach expect page  */

const { analyzeAccessibility } = require('../../../lib/accessibility')

const { integrationTestPort } = require('../../../constants')
const visit = (path) => page.goto(`http://localhost:${integrationTestPort}${path}`)

describe('HMRC design patterns', () => {
  const viewPortDimensions = page.viewport();

  beforeEach(async () => {
    await visit('/hmrc-design-patterns')
  })

  afterEach(async () => {
    await page.setViewport(viewPortDimensions)
  })

  it('should not have accessibility issues', async () => {
      const accessibilityReport = await analyzeAccessibility(page);
      expect(accessibilityReport).toHaveNoAccessibilityIssues();
  });

  it('should have the correct meta title', async () => {
    const title = await page.title()
    expect(title).toBe('HMRC design patterns - Design resources for HMRC — GOV.UK')
  })

  it('should have the correct page heading', async () => {
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toBe('HMRC design patterns')
  })
})
