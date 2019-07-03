import common from 'govuk-frontend/common'

import AppTabs from './components/tabs.js'
import LanguageSwitchExample from './components/language-switch-example'

import './components/example.js'

var nodeListForEach = common.nodeListForEach

// Initialise tabs
var $tabs = document.querySelectorAll('[data-module~="app-tabs"]')
nodeListForEach($tabs, function ($tabs) {
  new AppTabs($tabs).init()
})

// Initialise language switch
var $languageSwitchExamples = document.querySelectorAll('[data-module~="app-language-switch-example"]')
nodeListForEach($languageSwitchExamples, function ($example) {
  new LanguageSwitchExample($example).init()
})
