const toggleActiveClass = 'active'

function SubNavToggle ($module) {
  this.$module = $module
}

SubNavToggle.prototype.init = function() {
  if (!this.$module) {
    return
  }
  this.$module.addEventListener('click', this.handleClick.bind(this))

}

SubNavToggle.prototype.handleClick = function(event) {
  if (event.target.parentNode.classList.contains(toggleActiveClass)) {
    this.$module.classList.remove(toggleActiveClass)
  } else {
    this.$module.classList.add(toggleActiveClass)
  }
}

export default SubNavToggle
