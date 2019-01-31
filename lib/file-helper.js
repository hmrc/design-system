const fs = require('fs')
const nunjucks = require('nunjucks')
const matter = require('gray-matter')
const beautify = require('js-beautify').html
const pathFromRoot = require('../tasks/gulp/util').pathFromRoot

const templatePaths = [
  pathFromRoot('node_modules', 'hmrc-frontend', 'components'),
  pathFromRoot('application', 'templates'),
  pathFromRoot('application', 'templates', 'partials'),
  pathFromRoot('src')
]

nunjucks.configure(templatePaths)

// This helper function takes a path of a file and
// returns the contents as string
exports.getFileContents = path => {
  let fileContents
  try {
    fileContents = fs.readFileSync(path)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(err.message)
    } else {
      throw err
    }
  }
  return fileContents.toString()
}

// This helper function takes a path of a *.njk file and
// returns the HTML rendered by Nunjucks without markdown data
exports.getHTMLCode = path => {
  let fileContents = this.getFileContents(path)

  let parsedFile = matter(fileContents)
  let content = parsedFile.content

  let html
  try {
    html = nunjucks.renderString(content)
  } catch (err) {
    if (err) {
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
