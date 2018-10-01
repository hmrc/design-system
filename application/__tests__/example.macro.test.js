// 1. Expect example macro to render a header

const fs = require('fs')
const path = require('path')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))
// const macro = fs.readFileSync(path.join(__dirname, '..', 'macros', 'example.macro.njk')).toString()
let HtmlDomDoc = new Document()
console.log(HtmlDomDoc)
const options = {
  path: path.join(__dirname, '..', 'macros')
}

describe('Example macro', () => {
  test('should render a header with Hello world', () => {
    const templateString = `
    {% from "example.macro.njk"  import example %}
    
    {{ example({html: 'Hello'}) }}`

    const htmlString = nunjucks.render(templateString, options)
    console.log(htmlString)
    expect(htmlString).toContain('Hello')
  })
})

