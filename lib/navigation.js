const path = require('path')

const capitaliseFirstLetter = string => {
  const [firstWord, ...otherWords] = string.split('-')
  const [firstLetter, ...otherLetters] = firstWord

  const capitalisedWord =
    firstLetter.toUpperCase() +
    otherLetters.join('').toLowerCase()

  return [ capitalisedWord, otherWords.join(' ') ].join(' ').trim()
}

module.exports = function () {
  return function (files, metalsmith, done) {
    const navigation = []

    for (const filepath in files) {
      const { dir } = path.parse(filepath)
      const { menuText } = files[filepath];

      const [section, pattern] = dir.split('/')
      const patternName = pattern && capitaliseFirstLetter(pattern)
      const text = menuText || patternName;
      const href = [section, pattern].join('/');
      const isUnique = !navigation.find(item => item.href === href)

      if (text && isUnique) {
        const item = {
          section,
          filepath,
          text,
          href,
        }

        navigation.push(item)
      }
    }

    metalsmith.metadata().navigation = navigation

    done()
  }
}
