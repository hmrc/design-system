import common from 'govuk-frontend/common'
import hmrcFrontend from 'hmrc-frontend/all'
import govUkFrontend from 'govuk-frontend/all'

import AppTabs from './components/tabs.js'
import SubNavToggle from './components/subnav.js'

import LanguageSwitchExample from './components/language-switch-example'

import './components/example.js'

const nodeListForEach = common.nodeListForEach

// Initialise tabs
const $tabs = document.querySelectorAll('[data-module~="app-tabs"]')
nodeListForEach($tabs, $tab => {
  new AppTabs($tab).init()
})

// Initialise nav toggles
const $toggles = document.querySelectorAll('[data-module~="subnav-toggle"]')
nodeListForEach($toggles, $toggle => {
  new SubNavToggle($toggle).init()
})

// Initialise language switch
const $languageSwitchExamples = document.querySelectorAll('[data-module~="app-language-switch-example"]')
nodeListForEach($languageSwitchExamples, $example => {
  new LanguageSwitchExample($example).init()
})

hmrcFrontend.initAll()
govUkFrontend.initAll()
