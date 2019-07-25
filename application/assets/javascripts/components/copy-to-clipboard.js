import ClipboardJS from 'clipboard'

function CopyToClipboard ($module) {
  this.$module = $module
}

CopyToClipboard.prototype.init = function () {
  if (!this.$module) {
    return
  }

  try {
    new ClipboardJS(this.$module, {
      target: trigger => trigger.nextElementSibling
    }).on('success', this.handleSuccess)
  } catch (err) {
    if (err) {
      console.error(err.message)
    }
  }
}

CopyToClipboard.prototype.handleSuccess = function (e) {
  e.trigger.text = 'Copied'
  e.clearSelection()
  setTimeout(() => {
    e.trigger.text = 'Copy'
  }, 5000)
}

export default CopyToClipboard
