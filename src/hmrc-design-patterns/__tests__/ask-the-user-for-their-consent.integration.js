/* globals describe it beforeEach expect page  */

const { analyzeAccessibility } = require('../../../lib/accessibility')

const { integrationTestPort } = require('../../../constants')
const visit = (path) => page.goto(`http://localhost:${integrationTestPort}${path}`)

describe('Design pattern page rendering', () => {
  beforeEach(async () => {
    await visit('/hmrc-design-patterns/ask-the-user-for-their-consent/')
  })

  it('should not have accessibility issues', async () => {
      const accessibilityReport = await analyzeAccessibility(page)
      expect(accessibilityReport).toHaveNoAccessibilityIssues()
  })

  it('should have the correct meta title', async () => {
    const title = await page.title()
    expect(title).toBe('Ask the user for their consent - HMRC Design Patterns - Design resources for HMRC – GOV.UK')
  })

  describe('iFrame resizer', () => {
    it('should automatically set a height property on all iframes', async () => {
      const noHeightProperty = await page.$$eval('iframe', iframes => iframes.filter(iframe => !iframe.style.height))
      expect(noHeightProperty).toHaveLength(0)
    })

    it('should automatically size iframes to ensure all content is displayed', async () => {
      const resizeFailed = await page.$$eval('iframe', (iframes) => {
        const isFrameATardis = iframe => iframe.offsetHeight < iframe.contentWindow.document.body.offsetHeight
        return iframes.filter(isFrameATardis)
      })
      expect(resizeFailed).toHaveLength(0)
    })
  })

  describe('Copy snippet button', () => {
    const buttonSelector = '#example-yes-no-question-html .app-link--copy'

    beforeEach(async () => {
      await page.click('.example-example-yes-no-question-lang ul > li:first-child > a')
      await page.click(buttonSelector)
    })

    it('should change the button text to `copied` when clicked', async () => {
      const buttonText = await page.$eval(buttonSelector, btn => btn.textContent)
      expect(buttonText).toBe('Copied')
    })

    it('should reset text to `Copy` after an interval', async () => {
      let buttonText
      await new Promise(resolve => setTimeout(async () => {
        buttonText = await page.$eval(buttonSelector, btn => btn.textContent)
        resolve()
      }, 5000))

      expect(buttonText).toBe('Copy')
    }, 6000)
  })
})
