var linkLocator = '.govuk-link[href^="#"]'
var sectionButtonLocator = '.govuk-accordion__section-button'

function Accordion ($module) {
  this.$module = $module
  this.$allAnchorLinks = this.$module.querySelectorAll(linkLocator)
  this.$allSectionButtons = this.$module.querySelectorAll(sectionButtonLocator)
  this.$mappedSectionButtons = {}
}

Accordion.prototype.init = function () {
  if (!this.$module) {
    return
  }
  this.$allAnchorLinks.forEach(this.attachClick.bind(this))
  var self = this
  this.$allSectionButtons.forEach(function (button) {
    self.$mappedSectionButtons[button.textContent.trim().toLowerCase()] = button.id
  })
}

Accordion.prototype.attachClick = function (link) {
  link.addEventListener('click', this.handleClick.bind(this))
}

Accordion.prototype.handleClick = function (evt) {
  var section = evt.target.hash[1].trim().toLowerCase()
  var button = this.$module.querySelector('#' + this.$mappedSectionButtons[section])
  if (button.getAttribute('aria-expanded') !== 'true') {
    button.click()
  }
}

export default Accordion
