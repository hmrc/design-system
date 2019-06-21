const fs = require('fs')
const nunjucks = require('nunjucks')
const matter = require('gray-matter')
const beautify = require('js-beautify').html

const templatePaths = require('./templatePaths')

nunjucks.configure(templatePaths)

// This helper function takes a path of a *.njk file and
// returns the HTML rendered by Nunjucks without markdown data
exports.getHTMLCode = path => {
  let fileContents = fs.readFileSync(path, 'utf-8')

  let parsedFile = matter(fileContents)
  let content = parsedFile.content

  let html
  try {
    html = nunjucks.renderString(content)
  } catch (err) {
    if (err) {
      console.log(err)
      console.log('Could not get HTML code from ' + path)
    }
  }

  return beautify(html.trim(), {
    indent_size: 2,
    end_with_newline: true,
    // If there are multiple blank lines, reduce down to one blank new line.
    max_preserve_newlines: 1,
    // set unformatted to a small group of elements, not all inline (the default)
    // otherwise tags like label arent indented properly
    unformatted: ['code', 'pre', 'em', 'strong']
  })
}

// This helper function takes a path of a *.md.njk file and
// returns the Nunjucks syntax inside that file without markdown data and imports
exports.getNunjucksCode = path => {
  var fileContents = fs.readFileSync(path, 'utf-8')

  let parsedFile = matter(fileContents)

  // Omit any `{% extends "foo.njk" %}` nunjucks code, because we extend
  // templates that only exist within the Design System – it's not useful to
  // include this in the code we expect others to copy.
  let content = parsedFile.content.replace(
    /{%\s*extends\s*\S*\s*%}\s+/,
    ''
  )

  return content
}
