
/**
 * Dependencies
 */

var parse = require('./lib/parse');
var cheerio = require('cheerio');

/**
 * Exports
 */

module.exports = function(html, url) {
  if (!html) return Promise.resolve(null);
  return parse(cheerio.load(html), url);
};
