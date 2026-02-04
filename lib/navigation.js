const path = require('path')
const sections = require('./navigation.json')

const capitaliseFirstLetter = string => {
  const [firstWord, ...otherWords] = string.split('-')
  const [firstLetter, ...otherLetters] = firstWord

  const capitalisedWord =
    firstLetter.toUpperCase() +
    otherLetters.join('').toLowerCase()

  return [ capitalisedWord, otherWords.join(' ') ].join(' ').trim()
}

const sortAlphabetically = (a, b) => {
  const itemA = a.text.toUpperCase();
  const itemB = b.text.toUpperCase();

  if(a?.order !== undefined && b?.order !== undefined) {
    return a.order - b.order
  } else if (a?.order !== undefined) {
    return -1;
  } else if (b?.order !== undefined) {
    return 1;
  } else if (itemA < itemB) {
    return -1;
  } else if (itemA > itemB) {
    return 1;
  }

  return 0;
}

module.exports = function () {
  return function (files, metalsmith, done) {
    const sectionItems = structuredClone(sections)

    for(const section of sectionItems) {
      const itemPaths = metalsmith.match(`${section.href}/**/index.njk`)

      if(!itemPaths.length) {
        continue
      }

      for (const itemPath of itemPaths) {
        const { menuText, status, navigationPlacement: placement = 'primary', order,  } = files[itemPath]

        const { dir } = path.parse(itemPath)
        const pathArray = dir.split(path.sep)
        const page = pathArray.at(-1)

        const pageName = page && capitaliseFirstLetter(page)
        const text = menuText || pageName;

        const isNotInDevelopment = status !== 'development'
        const isNotArchived = status !== 'archived'
        const isNotSectionPage = pathArray.length > 1
        const isPlaced = placement !== 'none'

        const isInMenu = text
          // && isUnique
          // && isComponentIndex
          && isNotSectionPage
          && isNotInDevelopment
          && isNotArchived
          && isPlaced

          if(isInMenu) {
            section.items ??= []

            section.items.push({
              filepath: path.dirname(itemPath),
              href: path.dirname(itemPath),
              placement,
              text,
              order
            })
          }
      }

      section.items?.sort(sortAlphabetically)
    }

    metalsmith.metadata().navigation = sectionItems

    done(null)
  }
}
