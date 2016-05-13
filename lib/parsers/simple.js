'use strict';

/**
 * Dependencies
 */

var debug = require('debug')('simple');

/**
 * Exports
 */

module.exports = function($) {
  return new Promise(resolve => {
    if (!$) return resolve({});
    var result = {};

    // title
    var title = $('title');
    if (title) result.title = title.text().trim();

    // description
    var description = $('meta[name="description"]');
    if (description) {
      const value = description.attr('content');
      if (value) result.description = value.trim();
    }

    // keywords
    var keywords = $('meta[name="keywords"]');
    if (keywords) {
      const value = keywords.attr('content');
      if (value) {
        result.keywords = value
          .split(',').map(string => string.trim());
      }
    }

    // theme color
    var themeColor = $('meta[name="theme-color"]');
    if (themeColor) {
      const value = themeColor.attr('content');
      if (value) result.theme_color = value.trim();
    }

    debug('result', result);
    resolve(result);
  });
};
