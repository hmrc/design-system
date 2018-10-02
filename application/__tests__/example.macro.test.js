// 1. Expect example macro to render a header

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

describe('Example macro', () => {

  const templateFactory = (parameters) => {
    // ToDo: check if there's a better way of handling the object passed in
    return `{%- from "example.macro.njk"  import example -%} 
    {{ example(${JSON.stringify(parameters)})
    }}`.toString()
  }

  test('should render an iFrame for the example', () => {
    const exampleId = 'test'
    const exampleSrc = path.join('example', options.globals.pathname, exampleId + '.html').toString()

    const templateString = `
    {%- from "example.macro.njk"  import example -%} 
    {{ example({html: '${exampleId}.html'}) }}`

    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById(`${exampleId}_frame`)
  
    expect(exampleFrame).not.toBeNull()
    expect(exampleFrame.tagName.toLowerCase()).toBe('iframe')
    expect(exampleFrame.name).toBe(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toEqual(defaultHeight)
    expect(exampleFrame.src).toMatch(exampleSrc)
  })

  test('should set the iframe height when it is supplied', () => {
    const exampleId = 'test'
    const frameHeight = 256

    const templateString = `
    {%- from "example.macro.njk"  import example -%} 
    {{ example({
      html: '${exampleId}.html', 
      height: ${frameHeight}}) 
    }}`

    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById(`${exampleId}_frame`)
    expect(parseInt(exampleFrame.height)).toBe(256)
  })

  test('should enable multiPage when the html paramater property is an Array ', () => {

    const parameters = { html: ['example1.html', 'example2.html'] }
    const templateString = templateFactory(parameters)

    exampleContainer.innerHTML = nunjucks.render(templateString, options).body
    const exampleFrame = document.getElementById('example1_frame')
    expect(exampleFrame.name).toBe('example1_frame')
  })
})
