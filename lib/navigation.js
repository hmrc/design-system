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
      const [section, pattern] = pathArray
      const patternName = pattern && capitaliseFirstLetter(pattern)
      const text = menuText || patternName
      const href = [section, pattern].join('/')

      const isComponentIndex = pathArray.length === 2
      const isUnique = !navigation.find(item => item.href === href)
      const isNotInDevelopment = status != 'development'

      if (text && isUnique && isComponentIndex && isNotInDevelopment) {
        const item = {
          filepath,
          href,
          placement,
          section,
          text,
        }

        navigation.push(item)
      }
    }

    metalsmith.metadata().navigation = [ ...navigation.sort(sortAlphabetically) ]

    done(null)
  }
}
