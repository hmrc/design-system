const nunjucks = require('jstransformer')(require('jstransformer-nunjucks'))

const string = nunjucks.render('<h1>Hello {{ name }}</h1>', {name: 'Ian'})

module.exports = string;


// var appViews = [
//   './macros/'
// ]
//
// nunjucks.configure(appViews, {
//   autoescape: true,
//   noCache: true
// })