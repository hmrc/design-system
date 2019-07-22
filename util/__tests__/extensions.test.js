const mockPackageJson = {
  dependencies: {
    'my-fake-module': '1.0.0',
    'my-other-fake-module': '1.0.0'
  }
};

jest.mock('fs', (returnVal) => ({
  existsSync: () => returnVal || true
}))

jest.mock('../../package.json', () => mockPackageJson, { virtual: true })

jest.mock('node_modules/my-fake-module/govuk-prototype-kit.config.json', () => ({
  assets: ['/path/to/templates']
}), { virtual: true })

jest.mock('node_modules/my-other-fake-module/govuk-prototype-kit.config.json', () => ({
  assets: ['/images', '/javascripts']
}), { virtual: true })

describe('Generating template paths from package.json', () => {
  let dependencies

  const readExtensionConfigSync = () => require('../extensions')

  beforeEach(() => {
    dependencies = readExtensionConfigSync('assets')
    console.log('helllo', typeof dependencies);
  })

  it('should return an array of dependencies', () => {
    expect(dependencies[0]).toEqual('foo')
  })
})
