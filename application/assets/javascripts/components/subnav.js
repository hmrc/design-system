const toggleActiveClass = 'active'

function SubNavToggle ($module) {
  this.$module = $module || document

  this.$nav = this.$module.querySelector('.app-pane__subnav')
  this.$navToggler = this.$module.querySelector('.app-subnav-toggle__button')

  this.mobileNavOpen = false

  this.mql = null
}

SubNavToggle.prototype.setHiddenStates = function () {
  if (this.mql === null || !this.mql.matches) {
    if (!this.mobileNavOpen) {
      this.$nav.setAttribute('hidden', '')
    }

    this.$navToggler.removeAttribute('hidden')
  } else if (this.mql === null || this.mql.matches) {
    this.$nav.removeAttribute('hidden')
    this.$navToggler.setAttribute('hidden', '')
  }
}

SubNavToggle.prototype.setInitialAriaStates = function () {
  this.$navToggler.setAttribute('aria-expanded', 'false')
}

SubNavToggle.prototype.bindUIEvents = function () {
  var $nav = this.$nav
  var $navToggler = this.$navToggler

  $navToggler.addEventListener('click', function (event) {
    if (this.mobileNavOpen) {
      $navToggler.parentNode.classList.remove(toggleActiveClass)
      $nav.setAttribute('hidden', '')

      $navToggler.setAttribute('aria-expanded', 'false')

      this.mobileNavOpen = false
    } else {
      $navToggler.parentNode.classList.add(toggleActiveClass)
      $nav.removeAttribute('hidden')

      $navToggler.setAttribute('aria-expanded', 'true')

      this.mobileNavOpen = true
    }
  }.bind(this))
}

SubNavToggle.prototype.init = function() {
  if (!this.$module) {
    return
  }

  if (typeof window.matchMedia === 'function') {
    this.mql = window.matchMedia('(min-width: 48.0625em)')
    this.mql.addEventListener('change', this.setHiddenStates.bind(this))
  }

  this.setHiddenStates()
  this.setInitialAriaStates()
  this.bindUIEvents()
}

export default SubNavToggle
