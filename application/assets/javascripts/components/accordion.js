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
  console.log(this.$allSectionButtons)
}

Accordion.prototype.attachClick = function (link) {
  link.addEventListener('click', this.handleClick.bind(this))
}

Accordion.prototype.handleClick = function (evt) {
  var section = evt.target.hash[1].trim().toLowerCase()
  // when we don't use parentNode then clicking an anchor link inside the accordion closes the accordion
  // https://github.com/hmrc/design-system/commit/8688f03be5773c275e393574f5da9d1705b9842e not sure why
  // this was removed, might be an unfinished partial refactoring
  var button = this.$module.querySelector('#' + this.$mappedSectionButtons[section]).parentNode
  if (button.getAttribute('aria-expanded') !== 'true') {
    button.click()
  }
}

export default Accordion
