
/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?\:\/\/?(?:www\.)?twitter\.com\/.+$/,

  title($) {
    var node = $('.ProfileHeaderCard-name');
    return node.length && node.first().text().trim();
  },

  description($) {
    var node = $('.ProfileHeaderCard-bio');
    return node.length && node.text().trim();
  },

  image($, { url }) {
    var node = $('.ProfileAvatar-image');
    var src = node.length && node.attr('src');
    return src && resolveUrl(url, src);
  },

  type() {
    return 'ProfilePage';
  }
});
