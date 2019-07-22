const mockPackageJson = {
  dependencies: {
    'my-fake-module': '1.0.0',
    'my-other-fake-module': '1.0.0',
    'i-do-not-have-any-assets': '1.0.0',
    'i-am-not-here': '1.0.0'
  }
};

jest.mock('fs', () => ({
  existsSync: (fileName) => !fileName.includes('i-am-not-here')
}))

jest.mock('../../package.json', () => mockPackageJson, { virtual: true })

jest.mock('node_modules/my-fake-module/govuk-prototype-kit.config.json', () => ({
  assets: ['/assets']
}), { virtual: true })

jest.mock('node_modules/my-other-fake-module/govuk-prototype-kit.config.json', () => ({
  assets: ['/images', '/javascripts']
}), { virtual: true })

jest.mock('node_modules/i-do-not-have-any-assets/govuk-prototype-kit.config.json', () => ({
  foo: ['/bar']
}), { virtual: true })

jest.mock('../../util/pathFromRoot', () => (...args) => [...args].join('/').replace('//', '/'))

describe('Getting asset paths from dependency config files', () => {
  let dependencies

  const readExtensionConfigSync = require('../extensions')

  beforeEach(() => {
    dependencies = readExtensionConfigSync('assets')
  })

  it('should return an array of dependency objects containing an object for each individual asset reference', () => {
    expect(Array.isArray(dependencies)).toBeTruthy()
    expect(dependencies.length).toEqual(3)
    expect(typeof dependencies[0]).toBe('object')
  })

  it('should ignore any dependencies not in the filesystem', () => {
    expect(dependencies.find(i => i.module === 'i-am-not-here')).toBeFalsy()
  })

  it('should ignore any dependencies that do not have the requested item in the dependency config', () => {
    expect(dependencies.find(i => i.module === 'i-do-not-have-any-assets')).toBeFalsy()
  })

  describe('Dependency object', () => {
    it('should contain an item property corresponding to the requested item in the dependency config', () => {
      expect(dependencies[0].item).toBe('/assets')
      expect(dependencies[1].item).toBe('/images')
      expect(dependencies[2].item).toBe('/javascripts')
    })
    it('should contain a module property corresponding to the dependency name', () => {
      expect(dependencies[0].module).toBe('my-fake-module')
      expect(dependencies[1].module).toBe('my-other-fake-module')
      expect(dependencies[2].module).toBe('my-other-fake-module')
    })
  })
})
