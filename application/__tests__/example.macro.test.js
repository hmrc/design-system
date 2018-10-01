// 1. Expect example macro to render a header
/* global DOMParser describe test expect */

const { JSDOM } = require('jsdom')
const path = require('path')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))
let baseDocument = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="exampleContainer"></div></body></html>', { contentType: 'text/html' }).window.document
const options = {
  path: path.join(__dirname, '..', 'macros')
}

describe('Example macro', () => {
  test('should render a header with Hello world', () => {
    const templateString = `
    {% from "example.macro.njk"  import example %}
    
    {{ example({html: 'Hello'}) }}`

    const htmlString = nunjucks.render(templateString, options).body
    baseDocument.getElementById('exampleContainer').innerHTML = htmlString
    console.log(baseDocument.body.innerHTML)
    expect(htmlString).toContain('Hello')
  })
})
