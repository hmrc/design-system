import ClipboardJS from 'clipboard'

function CopyToClipboard ($module) {
  if (!($module instanceof HTMLElement) || !ClipboardJS.isSupported()) {
    return this
  }

  this.$module = $module
  this.$button = null
  this.$status = null
}

CopyToClipboard.prototype.init = function () {
  this.$button = document.createElement('button')
  this.$button.className = 'app-copy-button js-copy-button'
  this.$button.textContent = 'Copy'

  this.$status = document.createElement('span')
  this.$status.className = 'govuk-visually-hidden'
  this.$status.setAttribute('aria-live', 'assertive')

  this.$module.prepend(this.$button)
  this.$module.prepend(this.$status)

  this.copyAction()
}

CopyToClipboard.prototype.copyAction = function () {
  try {
    new ClipboardJS(this.$button, {
      target: (trigger) => trigger.nextElementSibling
    }).on('success', (event) => {
      this.$button.textContent = 'Copied'
      this.$status.textContent = 'Copied'
      event.clearSelection()
      setTimeout(() => {
        this.$button.textContent = 'Copy'
        this.$status.textContent = ''
      }, 5000)
    })
  } catch (err) {
    if (err) {
      console.error(err.message)
    }
  }
}

export default CopyToClipboard
