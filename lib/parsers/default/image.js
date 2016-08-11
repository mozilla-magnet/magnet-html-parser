'use strict';

/**
 * Dependencies
 */

var URL = require('url');

module.exports = function($, { url }) {
  var node = $('meta[property="og:image"]');
  var value = node.length && node.attr('content');
  if (value) return URL.resolve(url, value);
};
