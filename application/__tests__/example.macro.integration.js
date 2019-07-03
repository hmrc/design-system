/* globals describe test beforeEach expect page  */

const { integrationTestPort } = require('../../constants')

describe('Localhost', () => {
  beforeEach(async () => {
    await page.goto(`http://localhost:${integrationTestPort}`)
  })

  test('should be titled "HMRC Design System"', async () => {
    await expect(page.title()).resolves.toMatch('HMRC Design System')
  })
})
