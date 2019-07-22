/* globals describe test beforeEach expect page  */

const { integrationTestPort } = require('../../constants')
const visit = (path) => page.goto(`http://localhost:${integrationTestPort}${path}`)

describe('Example page rendering', () => {
  beforeEach(async () => {
    await visit('/design-library/ask-for-consent/')
  })

  test('should be titled "Ask the user for their consent"', async () => {
    const title = await page.title()
    expect(title).toBe('Ask the user for their consent - HMRC Design Patterns - Design resources for HMRC – GOV.UK')
  })

  test('iframes should have a style attribute with a height property', async () => {
    const noHeightProperty = await page.$$eval('iframe', iframes => iframes.filter(iframe => !iframe.style.height))
    expect(noHeightProperty).toHaveLength(0)
  })

  test('iframes should be resized to display all content', async () => {
    const resizeFailed = await page.$$eval('iframe', (iframes) => {
      const isFrameATardis = iframe => iframe.offsetHeight < iframe.contentWindow.document.body.offsetHeight
      return iframes.filter(isFrameATardis)
    })
    expect(resizeFailed).toHaveLength(0)
  })
})
