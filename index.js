
/**
 * Dependencies
 */

var toDom = require('./lib/html-parser');
var parse = require('./lib/parse')

/**
 * Exports
 */

module.exports = function(res) {
  return parse(toDom(res.body), res);
};
