// 1. Expect example macro to render a header
/* globals describe test expect */

const { JSDOM } = require('jsdom')
const path = require('path')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

function isArray (obj) { return Array.isArray(obj) }

const options = {
  path: path.join(__dirname, '..', 'macros'),
  trimBlocks: true,
  lstripBlocks: true,
  globals: { pathname: '/__tests__' },
  filters: { is_array: isArray }
}

const defaultHeight = 153

const { document } = (new JSDOM(
  '<!DOCTYPE html><html><head></head><body><div id="exampleContainer"></div></body></html>',
  { contentType: 'text/html' }))
  .window

let exampleContainer = document.getElementById('exampleContainer')

const templateFactory = (parameters) => {
  // ToDo: check if there's a better way of handling the object passed in
  return `{%- from "example.macro.njk"  import example -%} 
  {{ example(${JSON.stringify(parameters)})
  }}`.toString()
}

describe('Example macro', () => {
  const exampleId = 'test'
  const exampleSrc = path.join('/', 'example', options.globals.pathname, exampleId + '.html').toString()
  const parameters = { html: `${exampleId}.html` }
  const templateString = templateFactory(parameters)

  test('should render an iFrame for the example with the correct attribute values', () => {
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById(`${exampleId}_frame`)

    expect(exampleFrame).not.toBeNull()
    expect(exampleFrame.tagName.toLowerCase()).toBe('iframe')
    expect(exampleFrame.name).toBe(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toEqual(defaultHeight)
    expect(exampleFrame.src).toMatch(exampleSrc)
  })

  test('should set the iframe height when it is supplied', () => {
    const frameHeight = 256
    const templateString = templateFactory(Object.assign({ height: frameHeight }, parameters))

    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toBe(256)
  })

  test('should have a link to open the example html in a new window or tab', () => {
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleLink = document.querySelector('.app-example__link a')
    expect(exampleLink).not.toBeNull()
    expect(exampleLink.href).toBe(exampleSrc)
    expect(exampleLink.target).toBe('_blank')
  })

  test('Should not have a language toggle for English only examples', () => {
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const languageToggleLink = document.querySelector('a.language-toggle')
    expect(languageToggleLink).toBeNull()
  })
  test('Should include a language toggle for examples with a Welsh version', () => {
    const savedGlobals = JSON.parse(JSON.stringify(options.globals))

    options.globals = Object.assign({ hasWelsh: true }, options.globals)
    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const languageToggleLink = document.querySelector('a.language-toggle')
    expect(languageToggleLink).not.toBeNull()

    options.globals = savedGlobals
  })
})

describe('When the example has multiple pages the example macro', () => {
  test('should set the iframe to use the first example page when the html parameter is an Array', () => {
    const parameters = { html: ['example1.html', 'example2.html'] }
    const templateString = templateFactory(parameters)

    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById('example1_frame')
    expect(exampleFrame.name).toBe('example1_frame')
    expect(exampleFrame.src).toBe('/example/__tests__/' + parameters.html[0])
  })
})
