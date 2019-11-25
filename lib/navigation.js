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

  let comparison = 0;

  if (itemA > itemB) {
    comparison = 1;
  } else if (itemA < itemB) {
    comparison = -1;
  }

  return comparison;
}

module.exports = function () {
  return function (files, metalsmith, done) {
    const navigation = []

    for (const filepath in files) {
      const { dir } = path.parse(filepath)
      const { menuText, status, navigationPlacement: placement = 'primary' } = files[filepath]

      const pathArray = dir.split('/')
      const [section, page] = pathArray
      const pageName = page && capitaliseFirstLetter(page)
      const text = menuText || pageName
      const href = [section, page].join('/')

      const isComponentIndex = pathArray.length === 2

      const navSection = navigation.find(({ title }) => title === section)
      const isUnique = !navSection || !navSection.items.find(item => item.href === href)

      const isNotInDevelopment = status != 'development'
      const shouldAppearInMenu = text
        && isUnique
        && isComponentIndex
        && isNotInDevelopment
        && placement !== 'none'

      if (shouldAppearInMenu) {
        const item = {
          filepath: path.dirname(filepath),
          href,
          placement,
          text,
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
