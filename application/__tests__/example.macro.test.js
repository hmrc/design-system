/* globals xdescribe describe test expect */

const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))
const filters = require('../../lib/filters')
const globals = require('../../lib/globals')
const pathFromRoot = require('../../util/pathFromRoot')
const templatePaths = [
  ...require('../../lib/templatePaths'),
  pathFromRoot('application', '__tests__', 'fixtures')
]

const htmlEscape = htmlString => htmlString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const nunjucksEscape = nunjucksString => nunjucksString.replace(/\{% raw %\}\n/, '').replace(/\{% endraw %\}/, '')
const exampleId = 'test'

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals
}

const fixturePath = path.join(__dirname, 'fixtures', 'test-component', 'examples')
const defaultHeight = 153

const templateFactory = (parameters) => {
  // ToDo: check if there's a better way of handling the object passed in
  return `{%- from "_example.njk"  import example with context-%}
  {{ example(${JSON.stringify(parameters)})
  }}`.toString()
}
const documentFactory = function (parameters, options) {
  const document = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="exampleContainer"></div></body></html>',
    { contentType: 'text/html' }
  ).window.document

  const exampleContainer = document.getElementById('exampleContainer')
  const templateString = templateFactory(parameters)
  exampleContainer.innerHTML = nunjucks.render(templateString, options).body
  return document
}

describe.only('Single page example macro english html only', () => {
  const parameters = { item: 'new-tab-link', example: 'default' }
  const document = documentFactory(parameters, options)
  const exampleSrc = path.join('examples', exampleId + '.html').toString()
  const exampleFrame = document.getElementById(`${exampleId}_frame`)
  const exampleLink = document.querySelector('.app-example__link a')

  test.only('should render an iFrame for the example with the correct attribute values', () => {
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
    expect(codeExampleTabsContainer.nodeName.toLowerCase()).toBe('ul')

    const exampleToggleLinks = codeExampleTabsContainer.querySelectorAll('li.app-tabs__item a')
    expect(exampleToggleLinks.length).toBe(1)

    const htmlExampleToggleLink = exampleToggleLinks[0]
    expect(htmlExampleToggleLink.nodeName.toLowerCase()).toBe('a')
    expect(htmlExampleToggleLink.getAttribute('href')).toBe(`#${exampleId}_html`)
    expect(htmlExampleToggleLink.getAttribute('aria-controls')).toBe(`${exampleId}_html`)
    expect(htmlExampleToggleLink.text).toBe('HTML')
  })

  test('should set the iframe height when it is supplied', () => {
    const frameHeight = 256
    const document = documentFactory(Object.assign({ height: frameHeight }, parameters), options)
    const exampleFrame = document.getElementById(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toBe(256)
  })

  test('Should include the escaped HTML markup from the examples', () => {
    const exampleHTMLCode = document.getElementById(`${exampleId}_html`)
    const fixtureHTML = fs.readFileSync(path.join(fixturePath, 'test.html')).toString()
    expect(exampleHTMLCode.querySelector('pre code').innerHTML).toEqual(htmlEscape(fixtureHTML))
  })
})

xdescribe('When a pattern has a nunjucks example', () => {
  const parameters = { html: `${exampleId}.html`, nunjucks: `${exampleId}.njk` }
  const document = documentFactory(parameters, options)

  test('should have a button to show Nunjucks example', () => {
    const codeExampleTabsContainer = document.getElementsByClassName('app-tabs')[0]

    const exampleToggleLinks = codeExampleTabsContainer.querySelectorAll('li.app-tabs__item a')
    expect(exampleToggleLinks.length).toBe(2)

    const nunjucksExampleToggleLink = exampleToggleLinks[1]
    expect(nunjucksExampleToggleLink.nodeName.toLowerCase()).toBe('a')
    expect(nunjucksExampleToggleLink.getAttribute('href')).toBe(`#${exampleId}_nunjucks`)
    expect(nunjucksExampleToggleLink.getAttribute('aria-controls')).toBe(`${exampleId}_nunjucks`)
    expect(nunjucksExampleToggleLink.text).toBe('Nunjucks')
  })

  test(' Should include the Nunjcks macro code for the example\n\t\u001b[33;1mTODO: needs a better way to do the inclusion\u001b[0m', () => {
    const exampleCode = document.getElementById(`${exampleId}_nunjucks`)
    const fixtureCode = fs.readFileSync(path.join(fixturePath, 'test.njk')).toString()
    expect(exampleCode.querySelector('pre code').innerHTML).toEqual(nunjucksEscape(fixtureCode))
  })
})

xdescribe('When a pattern has Welsh content', () => {
  const welshOptions = JSON.parse(JSON.stringify(options))
  welshOptions.filters = Object.assign({}, options.filters)
  welshOptions.globals = Object.assign({ hasWelsh: true }, welshOptions.globals)

  const parameters = { html: `${exampleId}.html` }

  const document = documentFactory(parameters, welshOptions)

  test('Should include a language toggle for examples', () => {
    const languageToggleLink = document.querySelector('a.language-toggle')
    expect(languageToggleLink).not.toBeNull()
  })

  test('Should have a Welsh Language example version in a hidden div', () => {
    const exampleHTMLCode = document.getElementById(`${exampleId}_welsh`)
    expect(exampleHTMLCode.classList).toContain('govuk-visually-hidden')
    expect(exampleHTMLCode.getAttribute('aria-hidden')).toBe('true')

    const fixtureHTML = fs.readFileSync(path.join(fixturePath, 'test.cy.html')).toString()
    expect(exampleHTMLCode.querySelector('pre code').innerHTML).toEqual(htmlEscape(fixtureHTML))
  })
})

xdescribe('Multipage example macro', () => {
  const parameters = { html: ['example1.html', 'example2.html'] }
  const document = documentFactory(parameters, options)
  const exampleFrame = document.getElementById('example1_frame')

  test('should set the iframe to use the first example page when the html parameter is an Array', () => {
    expect(exampleFrame.name).toBe('example1_frame')
    expect(exampleFrame.src).toBe('examples' + '/' + parameters.html[0])
  })
  test('should not include the example code buttons by default', () => {
    expect(document.getElementsByClassName('app-tabs__item').length).toBe(0)
  })
  test('should include the example code buttons when requested', () => {
    const parameters = {
      html: ['test.html', 'test.html'],
      showExampleCode: true
    }
    const exampleToggleLinks = documentFactory(parameters, options).getElementsByClassName('app-tabs__item')
    expect(exampleToggleLinks.length).toBeGreaterThan(0)
  })
})
