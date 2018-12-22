const path = require('path')

const capitaliseFirstLetter = string => {
  const [firstWord, ...otherWords] = string.split('-')
  const [firstLetter, ...otherLetters] = firstWord

  const capitalisedWord =
    firstLetter.toUpperCase() +
    otherLetters.join('').toLowerCase()

  return [ capitalisedWord, otherWords ].join(' ').trim()
}

module.exports = function () {
  return function (files, metalsmith, done) {
    const navigation = []

    for (const file in files) {
      const { dir } = path.parse(file)
      const [section, pattern] = dir.split('/')
      const patternName = pattern && capitaliseFirstLetter(pattern)
      const isUnique = !navigation.find(item => item.text === patternName)

      if (patternName && isUnique) {
        const item = {
          section,
          text: patternName,
          href: [section, pattern].join('/')
        }

        navigation.push(item)
      }
    }

    metalsmith.metadata().navigation = navigation

    done()
  }
}
