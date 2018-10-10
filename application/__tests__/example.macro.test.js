// 1. Expect example macro to render a header
/* globals describe test expect beforeEach */

const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))
const { getDirectoryFromFilepath, isArray } = require('../filters/hmrc-design-system')
const htmlEscape = htmlString => htmlString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const exampleId = 'test'

const options = {
  path: [
    path.join(__dirname, '..', 'macros'),
    path.join(__dirname, '..', 'partials'),
    path.join(__dirname, '..', '..', 'src'),
    path.join(__dirname, '..', '..', 'src'),
    path.join(__dirname, 'fixtures')
  ],
  trimBlocks: true,
  lstripBlocks: true,
  filters: { is_array: isArray, dirname: getDirectoryFromFilepath },
  globals: { filepath: 'test-component/index.njk' }
}

//const fixturePath = path.join(__dirname, 'fixtures', 'test-component', 'examples', 'test.html')
const fixturePath = path.join(__dirname, 'fixtures', 'test-component', 'examples')
const defaultHeight = 153

const templateFactory = (parameters) => {
  // ToDo: check if there's a better way of handling the object passed in
  return `{%- from "example.macro.njk"  import example with context-%} 
  {{ example(${JSON.stringify(parameters)})
  }}`.toString()
}
const newDocument = function() { 
  return new JSDOM('<!DOCTYPE html><html><head></head><body><div id="exampleContainer"></div></body></html>',
    { contentType: 'text/html' }
  ).window.document
}

describe('Single page example macro english html only', () => {
  const document = newDocument()
  const exampleContainer = document.getElementById('exampleContainer')
  const exampleSrc = path.join('examples', exampleId + '.html').toString()
  const parameters = { html: `${exampleId}.html` }
  const templateString = templateFactory(parameters)
  exampleContainer.innerHTML = nunjucks.render(templateString, options).body
  const exampleFrame = document.getElementById(`${exampleId}_frame`)
  const exampleLink = document.querySelector('.app-example__link a')

  test('should render an iFrame for the example with the correct attribute values', () => {
    expect(exampleFrame).not.toBeNull()
    expect(exampleFrame.tagName.toLowerCase()).toBe('iframe')
    expect(exampleFrame.name).toBe(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toEqual(defaultHeight)
    expect(exampleFrame.src).toMatch(exampleSrc)
  })

  test('should have a link to open the example html in a new window or tab', () => {
    expect(exampleLink).not.toBeNull()
    expect(exampleLink.href).toBe(exampleSrc)
    expect(exampleLink.target).toBe('_blank')
  })
  
  test('Should not have a language toggle for English only examples', () => {
    const languageToggleLink = document.querySelector('a.language-toggle')
    expect(languageToggleLink).toBeNull()
  })

  test('should have a button to show HTML code examples', () => {
    const codeExampleTabsContainer = document.getElementsByClassName('app-tabs')[0]
    const exampleToggleLinks = codeExampleTabsContainer.querySelectorAll('li.app-tabs__item a')
    const htmlExampleToggleLink = codeExampleTabsContainer.querySelector('li.app-tabs__item a')
    expect(exampleToggleLinks.length).toBe(1)
    expect(codeExampleTabsContainer.nodeName.toLowerCase()).toBe('ul')
    expect(htmlExampleToggleLink.nodeName.toLowerCase()).toBe('a')
    expect(htmlExampleToggleLink.getAttribute('href')).toBe(`#${exampleId}_html`)
    expect(htmlExampleToggleLink.getAttribute('aria-controls')).toBe(`${exampleId}_html`)
    expect(htmlExampleToggleLink.text).toBe('HTML')
  })
    
  test('should set the iframe height when it is supplied', () => {
    const document = newDocument()
    const exampleContainer = document.getElementById('exampleContainer')  
    const frameHeight = 256
    const templateString = templateFactory(Object.assign({ height: frameHeight }, parameters))
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toBe(256)
  })

  test('Should include a language toggle for examples', () => {
    const savedGlobals = JSON.parse(JSON.stringify(options.globals))
    options.globals = Object.assign({ hasWelsh: true }, options.globals)

    const document = newDocument()
    const exampleContainer = document.getElementById('exampleContainer')

    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const languageToggleLink = document.querySelector('a.language-toggle')
    expect(languageToggleLink).not.toBeNull()

    options.globals = savedGlobals
  })
  test('Should include the escaped HTML markup from the examples', () => {
    const exampleHTMLCode = document.getElementById(`${exampleId}_html`)
    const fixtureHTML = fs.readFileSync(path.join(fixturePath, "test.html")).toString()
    expect(exampleHTMLCode.querySelector('pre code').innerHTML).toEqual(htmlEscape(fixtureHTML))
  })
})

describe('When a pattern has a nunjucks example', () => {
  const document = newDocument()
  const exampleContainer = document.getElementById('exampleContainer')
  const parameters = { html: `${exampleId}.html`, nunjucks: `${exampleId}.njk` }
  const templateString = templateFactory(parameters)
  exampleContainer.innerHTML = nunjucks.render(templateString, options).body

  test('should have a button to show Nunjucks example', () => {
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const codeExampleTabsContainer = document.getElementsByClassName('app-tabs')[0]
    const exampleToggleLinks = codeExampleTabsContainer.querySelectorAll('li.app-tabs__item a')
    expect(codeExampleTabsContainer.nodeName.toLowerCase()).toBe('ul')
    expect(exampleToggleLinks.length).toBe(2)
    expect(exampleToggleLinks[1].nodeName.toLowerCase()).toBe('a')
    expect(exampleToggleLinks[1].getAttribute('href')).toBe(`#${exampleId}_nunjucks`)
    expect(exampleToggleLinks[1].getAttribute('aria-controls')).toBe(`${exampleId}_nunjucks`)
    expect(exampleToggleLinks[1].text).toBe('Nunjucks')
  })
  // ToDo: Example Nunjucks code container element
  test('\u001b[33;1mTODO: Should include the Nunjcks macro code for the example\u001b[0m', () => {
    const exampleCode = document.getElementById(`${exampleId}_nunjucks`)
    const fixtureCode = fs.readFileSync(path.join(fixturePath, 'test.njk')).toString()
    return Promise.resolve()
    /*
    expect(exampleCode.querySelector('pre code').innerHTML).toEqual(htmlEscape(fixtureCode))
   */
  })
})

// ToDo: Welsh Language flag stuff

describe('Multipage example macro', () => {
  const document = newDocument()
  const exampleContainer = document.getElementById('exampleContainer')
  const parameters = { html: ['example1.html', 'example2.html'] }
  const templateString = templateFactory(parameters)
  exampleContainer.innerHTML = nunjucks.render(templateString, options).body
  const exampleFrame = document.getElementById('example1_frame')

  test('should set the iframe to use the first example page when the html parameter is an Array', () => {
    expect(exampleFrame.name).toBe('example1_frame')
    expect(exampleFrame.src).toBe('examples' + '/' + parameters.html[0])
  })
  test('should not include the example code buttons by default', () => {
    expect(document.getElementsByClassName('app-tabs__item').length).toBe(0)
  })
  test('should include the example code buttons when requested', () => {
    const document = newDocument()
    const exampleContainer = document.getElementById('exampleContainer')
    const parameters = {
      html: ['test.html', 'test.html'],
      showExampleCode: true
    }
    const templateString = templateFactory(parameters)
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    expect(document.getElementsByClassName('app-tabs__item').length).toBeGreaterThan(0)
  })
})
