import ClipboardJS from 'clipboard'

function CopyToClipboard ($module) {
  this.$module = $module
}

CopyToClipboard.prototype.init = function () {
  if (!this.$module) {
    return
  }
  var $button = document.createElement('button')
  $button.className = 'app-copy-button js-copy-button'
  $button.setAttribute('aria-live', 'assertive')
  $button.textContent = 'Copy'

  this.$module.insertBefore($button, this.$module.firstChild)
  this.copyAction()
}

CopyToClipboard.prototype.copyAction = function () {
  try {
    new ClipboardJS('.js-copy-button', {
      target: trigger => trigger.nextElementSibling
    }).on('success', function (e) {
      e.trigger.textContent = 'Copied'
      e.clearSelection()
      setTimeout(() => {
        e.trigger.textContent = 'Copy'
      }, 5000)
    })
  } catch (err) {
    if (err) {
      console.error(err.message)
    }
  }
}

export default CopyToClipboard
