import hmrcFrontend from 'hmrc-frontend/hmrc/all'
import { initAll } from 'govuk-frontend/dist/govuk/all'

import AppTabs from './components/tabs'
import SubNavToggle from './components/subnav'
import CopyToClipboard from './components/copy-to-clipboard'
import Accordion from './components/accordion'
import PrintLink from './components/print-link'

import LanguageSwitchExample from './components/language-switch-example'

import './components/example'

// Initialise tabs
const $tabs = document.querySelectorAll('[data-module~="app-tabs"]')
$tabs.forEach($tab => {
  new AppTabs($tab).init()
})

// Initialise nav toggles
const $toggles = document.querySelectorAll('[data-module~="subnav-toggle"]')
$toggles.forEach($toggle => {
  new SubNavToggle($toggle).init()
})

// Initialise language switch
const $languageSwitchExamples = document.querySelectorAll('[data-module~="app-language-switch-example"]')
$languageSwitchExamples.forEach( $example => {
  new LanguageSwitchExample($example).init()
})

// Initialise copy to clipboard
const $copyToClipboardButtons = document.querySelectorAll('[data-module="app-copy"]')
$copyToClipboardButtons.forEach( $button => {
  new CopyToClipboard($button).init()
})

// Initialise temporary accordian workaround
const $accordions = document.querySelectorAll('[data-module~="govuk-accordion"]')
$accordions.forEach( $accordion => {
  new Accordion($accordion).init()
})

// Initialise print links
const $printLinks = document.querySelectorAll('[data-module="print-link"')
$printLinks.forEach($printLink => {
  new PrintLink($printLink).init()
})

hmrcFrontend.initAll()
initAll({
  errorSummary: {
    disableAutoFocus: true
  },
  notificationBanner: {
    disableAutoFocus: true
  }
})

window.hmrcDesignSystem = { CopyToClipboard }
