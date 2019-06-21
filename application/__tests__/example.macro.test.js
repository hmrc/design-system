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
const exampleId = 'example-default'

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals
}

const throwIfUsedWithNotOrRefactoredToArrowFunction = (context) => {
  if (context.isNot !== false) {
    throw new Error('This matcher doesn\'t yet support `.not`.')
  }
}

const fixturePath = path.join(__dirname, 'fixtures', 'test-component', 'examples')
expect.extend({
  toHaveAttributes: function(domElement, expectedAttributes) {
    throwIfUsedWithNotOrRefactoredToArrowFunction(this)

    const hasAttributes = Object.keys(expectedAttributes)
      .map(key => domElement.getAttribute(key) !== expectedAttributes[key] && `${key} did not match, expected [${key}] to match [${expectedAttributes[key]}] but received [${domElement.getAttribute(key)}]`)
      .filter(value => value !== false)

      return {
        pass: hasAttributes.length === 0,
        message: () => hasAttributes.join('\n') || 'blah'
    }
  }
})

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

describe('Single page example macro english', () => {
  const parameters = { item: 'new-tab-link', example: 'default' }
  const document = documentFactory(parameters, options)

  const exampleSrc = '/design-library/new-tab-link/default/'

  const exampleFrame = document.querySelector(`#${exampleId} iframe`)
  const exampleLink = document.querySelector('.app-example__link a')

  test('should render an iFrame for the example with the correct attribute values', () => {
    expect(exampleFrame).not.toBeNull()
    expect(exampleFrame.tagName.toLowerCase()).toBe('iframe')
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
    const tabLink = document.querySelector('ul.app-tabs li.js-tabs__item a[href="#example-default-html"]');
    const tabContentContainer = document.getElementById('example-default-html')
    expect(tabContentContainer).not.toBeNull()
    expect(tabLink).not.toBeNull()
    expect(tabLink.text).toBe('HTML')
    expect(tabLink).toHaveAttributes({
      'aria-controls': 'example-default-html',
      role: 'tab',
    })
  })

  test('should have a button to show Nunjucks code examples', () => {
    const tabLink = document.querySelector('ul.app-tabs li.js-tabs__item a[href="#example-default-nunjucks"]');
    const tabContentContainer = document.getElementById('example-default-nunjucks')
    expect(tabContentContainer).not.toBeNull()
    expect(tabLink).not.toBeNull()
    expect(tabLink.text).toBe('Nunjucks')
    expect(tabLink).toHaveAttributes({
      'aria-controls': 'example-default-nunjucks',
      role: 'tab',
    })
  })

  test('Should include the escaped HTML markup from the examples', () => {
    const exampleHTMLCode = document.querySelector('#example-default-html pre code')
    expect(exampleHTMLCode).toMatchSnapshot()
  })
})

describe('When a pattern has Welsh content', () => {
  test('test me', () => {
    expect(true).not.toBeTruthy()
  })
})

describe.only('Multipage example macro', () => {
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
