/* global jQuery GOVUK */

jQuery(function ($) {
  'use strict'
  $('.js-collapsible-collection').each(function () {
    return new GOVUK.CollapsibleCollection({ $el: $(this) })
  })
})

/* document.addEventListener("DOMContentLoaded", function(){
  'use strict'
  document.querySelectorAll('.js-collapsible-collection').forEach(function ($el) {
    console.log('$el', $el);
    return new GOVUK.CollapsibleCollection({ $el: $el })
  })
}); */

