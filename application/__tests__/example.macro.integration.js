const integrationTestPort = process.env.INTEGRATION_PORT || process.env.integration_port || 3000

describe('Localhost', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${integrationTestPort}`);
  });

  it('should be titled "HMRC Design System"', async () => {
    await expect(page.title()).resolves.toMatch('HMRC Design System');
  });
});
