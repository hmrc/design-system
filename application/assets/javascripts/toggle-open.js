;(function (global) {
  'use strict'
  var $ = global.jQuery
  var HMRC = global.HMRC || {}

  var details = $('#openToggle details')
  var openBtn = $('#open')
  var closeBtn = $('#close')

  HMRC.toggleOpen = {
    closeDetails: function (e) {
      $(openBtn).removeClass('active')
      $(closeBtn).addClass('active')
      if (e) {
        e.preventDefault()
      }
      details.each(function () {
        $(this).removeAttr('open')
      })
    },
    openDetails: function (e) {
      $(closeBtn).removeClass('active')
      $(openBtn).addClass('active')
      if (e) {
        e.preventDefault()
      }
      details.each(function () {
        $(this).attr('open', 'open')
      })
    },

    init: function () {
      this.closeDetails()
      $(openBtn).click(this.openDetails)
      $(closeBtn).click(this.closeDetails)
    }
  }
  global.HMRC = HMRC
})(window) // eslint-disable-line semi