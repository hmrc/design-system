import common from 'govuk-frontend/common'
import AppTabs from './components/tabs.js'

var nodeListForEach = common.nodeListForEach

// Initialise tabs
var $tabs = document.querySelectorAll('[data-module="app-tabs"]')
nodeListForEach($tabs, function ($tabs) {
  new AppTabs($tabs).init()
})
