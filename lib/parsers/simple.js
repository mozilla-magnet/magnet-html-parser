
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

    // title
    var title = $('title');
    if (title) result.title = title.text().trim();

    // description
    var description = $('meta[name="description"]');
    if (description) {
      var value = description.attr('content');
      if (value) result.description = value.trim();
    }

    // theme color
    var themeColor = $('meta[name="theme-color"]');
    if (themeColor) {
      var value = themeColor.attr('content');
      if (value) result.theme_color = value.trim();
    }

    debug('result', result);
    resolve(result);
  });
};
