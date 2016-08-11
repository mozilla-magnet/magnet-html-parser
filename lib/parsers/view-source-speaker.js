
/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?\:\/\/?(?:www\.)?viewsourceconf.org\/berlin-2016\/speakers\/.+$/,

  title($) {
    var node = $('.section_body h1');
    return node.length && node.first().text().trim();
  },

  description($) {
    var node = $('.section_body p').first();
    return node.length && node.text().trim().replace(/\s\s+/g, ' ');
  },

  image($, { url }) {
    var node = $('.section_body img');
    var src = node.length && node.attr('src');
    return src && resolveUrl(url, src);
  },

  type() {
    return 'Person';
  }
});
