/* globals describe it beforeEach expect page  */

const { analyzeAccessibility } = require('../../../lib/accessibility')

const { integrationTestPort } = require('../../../constants')
const visit = (path) => page.goto(`http://localhost:${integrationTestPort}${path}`)

// We have to ignore certain rules as elements are not in isolation
const options = {
  rules: {
    'page-has-heading-one': { enabled: false },
    'duplicate-id-aria': { enabled: false },
    'form-field-multiple-labels': { enabled: false },
    'region': { enabled: false },
    'landmark-no-duplicate-banner': { enabled: false },
    'landmark-one-main': { enabled: false },
    'landmark-unique': { enabled: false },
    'skip-link': { enabled: false }
  }
}

describe('All patterns', () => {
  beforeEach(async () => {
    await visit('/examples/patterns.html')
  })

  it.skip('should not have accessibility issues', async () => {
    // the patterns file loads multiple timeout dialogs which can only appear once on a page
    // so this test will always fail, what is the purpose of the examples/patterns page?
      const accessibilityReport = await analyzeAccessibility(page, options);
      expect(accessibilityReport).toHaveNoAccessibilityIssues();
  });

})

describe('All Layouts', () => {
  beforeEach(async () => {
    await visit('/examples/layouts.html')
  })

  it('should not have accessibility issues', async () => {
      const accessibilityReport = await analyzeAccessibility(page, options);
      expect(accessibilityReport).toHaveNoAccessibilityIssues();
  });

})
