/* globals describe test beforeEach expect page  */

const { integrationTestPort } = require('../../../constants')
const visit = (path) => page.goto(`http://localhost:${integrationTestPort}${path}`)

describe('HMRC content style guide', () => {
  beforeEach(async () => {
    await visit('/hmrc-design-patterns/')
  })

  test('should have the correct meta title', async () => {
    const title = await page.title()
    expect(title).toBe('HMRC Design Patterns - Design resources for HMRC – GOV.UK')
  })

  test('should have the correct page heading', async () => {
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toBe('HMRC Design Patterns')
  })

})
