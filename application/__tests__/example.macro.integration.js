/* globals describe test beforeEach expect page  */

const { integrationTestPort } = require('../../constants')

describe('Example page rendering', () => {
  beforeEach(async () => {
    await page.goto(`http://localhost:${integrationTestPort}/design-library/ask-for-consent/`)
  })

  test('should be titled "Ask the user for their consent"', async () => {
    const title = await page.title()
    expect(title).toMatch('Ask the user for their consent')
  })

  test('iframes should have a style attribute with a height property', async () => {
    const noHeightProperty = await page.$$eval('iframe', iframes => iframes.filter(iframe => !iframe.style.height))
    expect(noHeightProperty).toHaveLength(0)
  })

  test('iframes should be resized to display all content', async () => {
    const resizeFailed = await page.$$eval('iframe', iframes => iframes.filter(iframe => iframe.offsetHeight < iframe.contentWindow.document.body.offsetHeight))
    expect(resizeFailed).toHaveLength(0)
  })
})
