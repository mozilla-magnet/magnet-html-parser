
/**
 * Dependencies
 */

var debug = require('debug')('parse');
var parsers = [
  require('./parsers/simple.js'),
  require('./parsers/icon.js'),
  require('./parsers/manifest.js'),
  // require('./socialuser.js'),
  // require('./googleplay.js'),
  require('./parsers/open-graph.js'),
  require('./parsers/oembed.js'),
  // require('./oembed-service.js'),
];

/**
 * Exports
 */

module.exports = function(doc, res) {
  var result = { url: res.url };
  return parsers.reduce((previous, parser) => {
    return previous.then(result => {
      return parser(doc, res).then(data => {
        return Object.assign(result, data);
      });
    });
  }, Promise.resolve(result));
};
