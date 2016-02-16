
/**
 * Dependencies
 */

var jsdom = require('jsdom').jsdom;

/**
 * Exports
 */

 module.exports = function(html) {
  return jsdom(html, {
    userAgent: 'Gecko Like ;)',
    features: {
      FetchExternalResources: false
    }
  });
 };
