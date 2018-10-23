/* global jQuery GOVUK */

jQuery(function ($) {
  'use strict'
  $('.js-collapsible-collection').each(function () {
    return new GOVUK.CollapsibleCollection({ $el: $(this) })
  })
})
