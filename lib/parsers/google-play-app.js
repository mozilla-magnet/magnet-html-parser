'use strict';

/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?:\/\/play\.google\.com\/store\/apps\/details/,

  title($) {
    var node = $('.id-app-title').eq(0);
    return node.length && node.text().trim();
  },

  description($) {
    var node = $('[itemprop="description"]')
      .children()
      .first()
      .contents()
      .first();

    return node.length && node.text().trim().replace(/\s\s+/g, ' ');
  },

  image($, { url }) {
    var node = $('.full-screenshot').eq(0);
    var src = node.length && node.attr('src');
    return src && resolveUrl(url, src);
  },

  icon($, { url }) {
    var icon = $('.cover-image').eq(0);
    var src = icon.length && icon.attr('src');
    return src && resolveUrl(url, src);
  }
});
