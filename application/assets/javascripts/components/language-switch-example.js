// Taken from https://github.com/alphagov/govuk-design-system/blob/29b9cf8c30ac1514d16fc97adaf15100e5040f7d/src/javascripts/components/tabs.js

import 'govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind'
import 'govuk-frontend/govuk/vendor/polyfills/Element/prototype/classList'
import 'govuk-frontend/govuk/vendor/polyfills/Event'
import common from 'govuk-frontend/govuk/common'

var nodeListForEach = common.nodeListForEach

function LanguageSwitchExample ($module) {
  this.$module = $module
  this.$switches = this.$module.querySelectorAll('.app-example__language-switch')
  this.$iframe = this.$module.querySelector('[data-module~="app-example-frame"]')
  this.currentClassName = 'app-example__language-switch--current'
  this.getLanguageClass = function (lang) {
    return ['app-example__language-switch--', lang, '-activated'].join('')
  }
}

LanguageSwitchExample.prototype.init = function () {
  var self = this

  if (!this.$module) {
    return
  }

  nodeListForEach(this.$switches, function ($this) {
    $this.addEventListener('click', self.handleClick.bind(self))
  })
}

// Close current container on click
LanguageSwitchExample.prototype.handleClick = function (event) {
  var self = this
  event.preventDefault()
  var $target = event.target
  nodeListForEach(this.$module.querySelectorAll('.' + this.currentClassName), function ($option) {
    $option.classList.remove(self.currentClassName)
    $option.querySelector('a').focus()
  })
  this.$iframe.setAttribute('src', $target.getAttribute('href'))
  $target.parentNode.classList.add(this.currentClassName)
  this.$module.classList.remove(this.getLanguageClass('en'), this.getLanguageClass('cy'))
  this.$module.classList.add(this.getLanguageClass($target.getAttribute('data-lang')))
}

export default LanguageSwitchExample
