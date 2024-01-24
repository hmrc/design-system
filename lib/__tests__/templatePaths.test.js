const mockPackageJson = {
  dependencies: {
    'my-fake-module': '1.0.0',
    'my-other-fake-module': '1.0.0'
  }
};

jest.mock('../../package.json', () => mockPackageJson, { virtual: true })

jest.mock('/abc/def/ghi/node_modules/my-fake-module/govuk-prototype-kit.config.json', () => ({
  nunjucksPaths: ['/path/to/templates']
}), { virtual: true })

jest.mock('/abc/def/ghi/node_modules/my-other-fake-module/govuk-prototype-kit.config.json', () => ({
  nunjucksPaths: ['/components', '/patterns']
}), { virtual: true })

jest.mock('../../util/pathFromRoot', () => (...args) => ['/abc/def/ghi', ...args].join('/').replace('//', '/'))

describe('Generating template paths from package.json', () => {
  let templatePaths

  const fetchTemplatePaths = () => require('../templatePaths')

  beforeEach(() => {
    templatePaths = fetchTemplatePaths()
  })

  it('should include template path from module configuration', () => {
    expect(templatePaths[0]).toEqual('/abc/def/ghi/node_modules/my-fake-module/path/to/templates')
  })

  it('should support multiple modules', () => {
    expect(templatePaths[1]).toEqual('/abc/def/ghi/node_modules/my-other-fake-module/components')
  })

  it('should support multiple paths from one module', () => {
    expect(templatePaths[2]).toEqual('/abc/def/ghi/node_modules/my-other-fake-module/patterns')
  })

  it('should end with internal template paths', () => {
    expect(templatePaths.splice(-5)).toEqual([
      '/abc/def/ghi/application/templates',
      '/abc/def/ghi/application/templates/partials',
      '/abc/def/ghi/src',
      '/abc/def/ghi/govuk-frontend',
      '/abc/def/ghi/govuk-frontend/dist'
    ])
  })
})
