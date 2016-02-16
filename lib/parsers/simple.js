
/**
 * Dependencies
 */

var debug = require('debug')('simple');

/**
 * Exports
 */

module.exports = function(doc, res) {
  return new Promise((resolve, reject) => {
    var result = {};
    if (!doc) return result;

    if (doc.querySelector('title')) {
      result.title = doc.querySelector('title').textContent;
    }

    if (doc.querySelector('meta[name="description"]')) {
      result.description = doc.querySelector('meta[name="description"]').content;
    }

    debug('result', result);
    resolve(result);
  });
};
