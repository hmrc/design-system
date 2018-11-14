var exampleIframes = document.querySelectorAll('.js-example__frame')

const stylesheets = [
  '/assets/stylsheets/govuk-frontend.min.css',
  '/assets/stylsheets/hmrc-frontend.min.css'
]

function createStylesheetLink (filename) {
  var cssLink = document.createElement('link')

  cssLink.href = filename
  cssLink.rel = 'stylesheet'
  cssLink.type = 'text/css'

  return cssLink
}

exampleIframes.forEach(function (iframe) {
  iframe.onload = function (event) {
    const iframe = event.target

    stylesheets.forEach(function (stylesheet) {
      var stylesheetLink = createStylesheetLink(stylesheet)
      iframe.contentDocument.head.appendChild(stylesheetLink)
    })
  }
})
