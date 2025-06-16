const path = require('path')

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
    const navigation = []

    for (const filepath in files) {
      const { dir } = path.parse(filepath)
      const { menuText, status, navigationPlacement: placement = 'primary', order } = files[filepath]

      const pathArray = dir.split('/')
      const [section, page] = pathArray
      const pageName = page && capitaliseFirstLetter(page)
      const text = menuText || pageName
      const href = [section, page].join('/')

      const isComponentIndex = pathArray.length === 2

      const navSection = navigation.find(({ title }) => title === section)
      const isUnique = !navSection || !navSection.items.find(item => item.href === href)

      const isNotInDevelopment = status != 'development'
      const isNotArchived = status != 'archived'
      const shouldAppearInMenu = text
        && isUnique
        && isComponentIndex
        && isNotInDevelopment
        && isNotArchived
        && placement !== 'none'

      if (shouldAppearInMenu) {
        const item = {
          filepath: path.dirname(filepath),
          href,
          placement,
          text,
          order
        }

        if (navSection) {
          navSection.items.push(item)
          navSection.items.sort(sortAlphabetically)
        } else {
          navigation.push({
            title: section,
            items: [ item ]
          })
        }
      }
    }

    metalsmith.metadata().navigation = navigation

    done(null)
  }
}
