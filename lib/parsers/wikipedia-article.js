
/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?\:\/\/?(?:.+\.)?wikipedia\.org\/wiki\/.+$/,

  title($) {
    var node = $('#firstHeading');
    return node.length && node.first().text().trim();
  },

  description($) {
    var node = $('p').first();
    return node.length && node.text().trim().replace(/\s\s+/g, ' ');
  },

  image($, { url }) {
    var node = $('img').eq(0);
    var src = node.length && node.attr('src');
    return src && resolveUrl(url, src);
  },

  type() {
    return 'Article';
  },

  siteName() {
    return 'Wikipedia';
  },

  themeColor() {
    return '#ffffff';
  }
});
