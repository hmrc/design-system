/* globals describe it beforeEach expect page  */

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

  it('should have the correct meta title', async () => {
    const title = await page.title()
    expect(title).toBe('HMRC Design Patterns - Design resources for HMRC – GOV.UK')
  })

  it('should have the correct page heading', async () => {
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toBe('HMRC Design Patterns')
  })

  describe('Sub navigation', () => {
    describe('desktop', () => {
      it('should show the sub navigation on desktop', async () => {
        const navigationStyles = await page.$eval('.app-pane__subnav', el => ({ ...getComputedStyle(el) }))
        expect(navigationStyles.display).toBe('block')
      })

      it('should not show the sub navigation toggle on desktop', async () => {
        const toggleStyles = await page.$eval('.app-subnav-toggle', el => ({ ...getComputedStyle(el) }))
        expect(toggleStyles.display).toBe('none')
      })
    })

    describe('mobile', () => {
      beforeEach(async () => {
        const override = { ...viewPortDimensions, width: 450 }
        await page.setViewport(override)
      })

      it('should not show the sub navigation by default on mobile', async () => {
        const navigationStyles = await page.$eval('.app-pane__subnav', el => ({ ...getComputedStyle(el) }))
        expect(navigationStyles.display).toBe('none')
      })

      it('should show the sub navigation toggle on mobile', async () => {
        const toggleStyles = await page.$eval('.app-subnav-toggle', el => ({ ...getComputedStyle(el) }))
        expect(toggleStyles.display).toBe('block')
      })

      it('should toggle display of the sub navigation and active class on the toggle on click', async () => {
        await page.click('.app-subnav-toggle__label');
        let navigationStyles = await page.$eval('.app-pane__subnav', el => ({ ...getComputedStyle(el) }))
        let toggleClasses = await page.$eval('.app-subnav-toggle', el => el.className)
        expect(navigationStyles.display).toBe('block')
        expect(toggleClasses).toContain('active')

        await page.click('.app-subnav-toggle__label');
        navigationStyles = await page.$eval('.app-pane__subnav', el => ({ ...getComputedStyle(el) }))
        toggleClasses = await page.$eval('.app-subnav-toggle', el => el.className)
        expect(navigationStyles.display).toBe('none')
        expect(toggleClasses).not.toContain('active')
      })
    })
  })
})
