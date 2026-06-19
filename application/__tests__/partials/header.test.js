/* globals describe it expect */

const { JSDOM } = require('jsdom')
const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

const filters = require('../../../lib/filters')
const globals = require('../../../lib/globals')
const templatePaths = require('../../../lib/templatePaths')

const options = {
  path: templatePaths,
  trimBlocks: true,
  lstripBlocks: true,
  filters,
  globals
}

const navigation = [
  {
    "text": "Section 1",
    "href": "section-1",
    "items": [
      {
        "filepath": "section-1/item-1",
        "href": "section-1/item-1",
        "placement": "primary",
        "text": "Item 1",
        "topic": "none"
      }
    ]
  },
  {
    "text": "Single page section",
    "href": "single-page-section"
  }
]

const templateFactory = () => `{% include 'header.njk' %}`.toString()

const documentFactory = (params) => {
  const templateString = templateFactory()
  const html = nunjucks.render(templateString, { ...options, ...params }).body
  return new JSDOM(html).window.document
}

describe('Header partial', () => {
  const document = documentFactory({ "navigation": navigation, filepath: "/" })
  const serviceNavigation = document.querySelector('.govuk-service-navigation')

  it('should render some HTML', () => {
    expect(serviceNavigation.outerHTML).not.toBeNull()
  })

  it('should render links to each section ', () => {
    const navigation = [
      { "text": "Section 1", "href": "section-1", "items": [] },
      { "text": "Section 2", "href": "section-2", }
    ]
    const document = documentFactory({ "navigation": navigation, filepath: "/" })
    const serviceNavigation = document.querySelector('.govuk-service-navigation')
    const sectionLinks = serviceNavigation.querySelectorAll('.govuk-service-navigation__item a')

    expect(sectionLinks.length).toBe(2)

    expect(sectionLinks[0].textContent.trim()).toBe("Section 1")
    expect(sectionLinks[0].href).toBe("/section-1/")
  })

  it('should have aria-current=page if the current page is the top-level section page', () => {
    const navigation = [
      { "text": "Section 1", "href": "section-1", "items": [] },
      { "text": "Section 2", "href": "section-2", }
    ]
    const document = documentFactory({ "navigation": navigation, filepath: "section-1/" })
    const serviceNavigation = document.querySelector('.govuk-service-navigation')
    const currentPageSectionLink = serviceNavigation.querySelector('.app-service-navigation__link[aria-current="page"]')

    expect(currentPageSectionLink).not.toBeNull();
  })

  it('should have aria-current=true if the current page is a sub page of the section', () => {
    const navigation = [
      { "text": "Section 1", "href": "section-1", "items": [] },
      { "text": "Section 2", "href": "section-2", }
    ]
    const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1" })
    const serviceNavigation = document.querySelector('.govuk-service-navigation')
    const currentPageSectionLink = serviceNavigation.querySelector('.app-service-navigation__link[aria-current="true"]')

    expect(currentPageSectionLink).not.toBeNull();
  })

  it('should show the gov.uk service navigation link if there are no section items', () => {
    const navigation = [{ "text": "Section 1", "href": "section-1", }]
    const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1" })
    const serviceNavigation = document.querySelector('.govuk-service-navigation')
    const sectionLinkNoSubItems = serviceNavigation.querySelectorAll('.govuk-service-navigation__link:not(.app-service-navigation__link)')

    expect(sectionLinkNoSubItems.length).toBe(1)
  })

  it('should show the gov.uk service navigation link if the section is not active', () => {
    const navigation = [{ "text": "Section 1", "href": "section-1", items: [{ "item": "item1" }] }]
    const document = documentFactory({ "navigation": navigation, filepath: "not-section-1" })
    const serviceNavigation = document.querySelector('.govuk-service-navigation')
    const sectionLinkNoSubItems = serviceNavigation.querySelectorAll('.govuk-service-navigation__link:not(.app-service-navigation__link)')

    expect(sectionLinkNoSubItems.length).toBe(1)
  })

  describe('in a mobile view', () => {
    it('should have a sub-navigation if there are items in the section and the section is active', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "none"
        }]
      }
      ]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1" })
      const serviceNavigationSubNav = document.querySelector('.govuk-service-navigation .app-mobile-subnav')

      expect(serviceNavigationSubNav).not.toBeNull()
    })

    it('should not have sub-navigation if there are no items in the section and the section is active', () => {
      const navigation = [{ "text": "Section 1", "href": "section-1" }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/" })
      const serviceNavigationSubNav = document.querySelector('.govuk-service-navigation .app-mobile-subnav')

      expect(serviceNavigationSubNav).toBeNull()
    })

    it('should not have sub-navigation if there are items in the section and the section is not active', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "none"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-2/item-1" })
      const serviceNavigationSubNav = document.querySelector('.govuk-service-navigation .app-mobile-subnav')

      expect(serviceNavigationSubNav).toBeNull()
    })

    it('should have a separate list for every distinct placement', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "none"
        }]
      }, {
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-2",
          "href": "section-1/item-2",
          "placement": "secondary",
          "text": "Item 2",
          "topic": "none"
        }]
      }, {
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-3",
          "href": "section-1/item-3",
          "placement": "tertiary",
          "text": "Item 3",
          "topic": "none"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1" })
      const serviceNavigationSubNavSection = document.querySelectorAll('.govuk-service-navigation .app-mobile-subnav__section')


      expect(serviceNavigationSubNavSection.length).toBe(3)
    })

    it('should group multiple items together if they have the same placement value', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "none"
        }, {
          "filepath": "section-1/item-2",
          "href": "section-1/item-2",
          "placement": "secondary",
          "text": "Item 2",
          "topic": "none"
        }, {
          "filepath": "section-1/item-3",
          "href": "section-1/item-3",
          "placement": "primary",
          "text": "Item 3",
          "topic": "none"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1" })
      const serviceNavigationSubNavSection = document.querySelectorAll('.govuk-service-navigation .app-mobile-subnav__section')

      expect(serviceNavigationSubNavSection.length).toBe(2)
      expect(serviceNavigationSubNavSection[0].querySelectorAll('.app-mobile-subnav__section-item').length).toBe(2)
      expect(serviceNavigationSubNavSection[1].querySelectorAll('.app-mobile-subnav__section-item').length).toBe(1)
    })

    it('should group multiple items together if they have the same topic value', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "topic 1"
        }, {
          "filepath": "section-1/item-2",
          "href": "section-1/item-2",
          "placement": "secondary",
          "text": "Item 2",
          "topic": "topic 1"
        }, {
          "filepath": "section-1/item-3",
          "href": "section-1/item-3",
          "placement": "primary",
          "text": "Item 3",
          "topic": "topic 2"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1" })
      const serviceNavigationSubNavSection = document.querySelectorAll('.govuk-service-navigation .app-mobile-subnav__section')
      const primaryTopicEls = serviceNavigationSubNavSection[0].querySelectorAll('.app-mobile-subnav__topic-item')
      const secondaryTopicEls = serviceNavigationSubNavSection[1].querySelectorAll('.app-mobile-subnav__topic-item')

      expect(primaryTopicEls.length).toBe(2)
      expect(secondaryTopicEls.length).toBe(1)

      const primaryTopicElsHeadings = serviceNavigationSubNavSection[0].querySelectorAll('.app-mobile-subnav__topic-heading')
      expect(primaryTopicElsHeadings.length).toBe(2)
      expect(primaryTopicElsHeadings[0].textContent).toBe('topic 1')
      expect(primaryTopicElsHeadings[1].textContent).toBe('topic 2')

      const secondaryTopicElsHeadings = serviceNavigationSubNavSection[1].querySelectorAll('.app-mobile-subnav__topic-heading')
      expect(secondaryTopicElsHeadings.length).toBe(1)
      expect(secondaryTopicElsHeadings[0].textContent).toBe('topic 1')
    })

    it('should not group items together if they have the topic value set to "none"', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "topic 1"
        }, {
          "filepath": "section-1/item-2",
          "href": "section-1/item-2",
          "placement": "secondary",
          "text": "Item 2",
          "topic": "topic 1"
        }, {
          "filepath": "section-1/item-3",
          "href": "section-1/item-3",
          "placement": "primary",
          "text": "Item 3",
          "topic": "topic 2"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1" })
      const serviceNavigationSubNavSection = document.querySelectorAll('.govuk-service-navigation .app-mobile-subnav__section')
      const primaryTopicEls = serviceNavigationSubNavSection[0].querySelectorAll('.app-mobile-subnav__topic-item')
      const secondaryTopicEls = serviceNavigationSubNavSection[1].querySelectorAll('.app-mobile-subnav__topic-item')

      expect(primaryTopicEls.length).toBe(2)
      expect(secondaryTopicEls.length).toBe(1)

      const primaryTopicElsHeadings = serviceNavigationSubNavSection[0].querySelectorAll('.app-mobile-subnav__topic-heading')
      expect(primaryTopicElsHeadings.length).toBe(2)
      expect(primaryTopicElsHeadings[0].textContent).toBe('topic 1')
      expect(primaryTopicElsHeadings[1].textContent).toBe('topic 2')

      const secondaryTopicElsHeadings = serviceNavigationSubNavSection[1].querySelectorAll('.app-mobile-subnav__topic-heading')
      expect(secondaryTopicElsHeadings.length).toBe(1)
      expect(secondaryTopicElsHeadings[0].textContent).toBe('topic 1')
    })

    it('should have an active item class if the page URL matches the items href', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "none"
        }, {
          "filepath": "section-1/item-2",
          "href": "section-1/item-2",
          "placement": "primary",
          "text": "Item 2",
          "topic": "none"
        }, {
          "filepath": "section-1/item-3",
          "href": "section-1/item-3",
          "placement": "primary",
          "text": "Item 3",
          "topic": "none"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1/" })
      const serviceNavigationSubNavItem = document.querySelectorAll('.govuk-service-navigation .app-mobile-subnav__section-item--active')

      expect(serviceNavigationSubNavItem.length).toBe(1)
      expect(serviceNavigationSubNavItem[0].textContent.trim()).toBe("Item 1")
    })

    it('should have a link with aria-current="page" attribute if the page URL matches the items href', () => {
      const navigation = [{
        "text": "Section 1",
        "href": "section-1",
        "items": [{
          "filepath": "section-1/item-1",
          "href": "section-1/item-1",
          "placement": "primary",
          "text": "Item 1",
          "topic": "none"
        }, {
          "filepath": "section-1/item-2",
          "href": "section-1/item-2",
          "placement": "primary",
          "text": "Item 2",
          "topic": "none"
        }, {
          "filepath": "section-1/item-3",
          "href": "section-1/item-3",
          "placement": "primary",
          "text": "Item 3",
          "topic": "none"
        }]
      }]
      const document = documentFactory({ "navigation": navigation, filepath: "section-1/item-1/" })
      const serviceNavigationSubNavItem = document.querySelectorAll('.govuk-service-navigation .app-service-navigation__link[aria-current="page"]')

      expect(serviceNavigationSubNavItem.length).toBe(1)
      expect(serviceNavigationSubNavItem[0].textContent.trim()).toBe("Item 1")
    })
  })
})
