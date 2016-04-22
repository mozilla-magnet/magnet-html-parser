
/**
 * Dependencies
 */

var exec = require('./lib/parse');
var cheerio = require('cheerio');

/**
 * Exports
 */

module.exports = parse;

// providing an optional method interface allows
// users to easily stub it out for testing
module.exports.parse = parse;

/**
 * Parse an html document string.
 *
 * @param  {String} html
 * @param  {String} baseUrl
 * @return {Promise<Object>}
 */
function parse(html, baseUrl) {
  if (!html) return Promise.resolve(null);
  return exec(cheerio.load(html), baseUrl);
};
