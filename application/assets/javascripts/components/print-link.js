function PrintLink ($module) {
  this.$module = $module
}

PrintLink.prototype.init = function() {
  if (!this.$module) {
    return
  }
  this.$module.addEventListener('click', function () {
    window.print()
  })

}

export default PrintLink
