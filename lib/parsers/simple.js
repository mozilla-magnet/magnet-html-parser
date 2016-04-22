
/**
 * Dependencies
 */

var debug = require('debug')('simple');

/**
 * Exports
 */

module.exports = function($) {
  return new Promise((resolve, reject) => {
    if (!$) return resolve({});
    var result = {};

    var title = $('title');
    if (title) result.title = title.text();

    var description = $('meta[name="description"]');
    if (description) {
      var value = description.attr('content');
      if (value) result.description = description.attr('content');
    }

    debug('result', result);
    resolve(result);
  });
};
