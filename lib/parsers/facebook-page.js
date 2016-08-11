'use strict';

/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?\:\/\/?(?:www\.)?facebook\.com\/.+$/,

  title($, { jsonLd }) {
    var node = $('#fb-timeline-cover-name');
    if (node.length) return node.first().text().trim();
    return jsonLd && jsonLd.name;
  },

  description($, { jsonLd }) {
    if (jsonLd && jsonLd.jobTitle && jsonLd.address && jsonLd.address.addressLocality) {
      return `${jsonLd.jobTitle}, ${jsonLd.address.addressLocality}`;
    }

    var node = $('meta[name="description"]');
    return node.length && node.attr('content');
  },

  image($, { url }) {
    var node = $('.profilePic');
    var src = node.length && node.attr('src');
    if (src) return resolveUrl(url, src);

    node = $('body script').eq(0);
    var result = node.length && node.html().match(/coverPhotoData.+?uri":"([^"]+)/);
    src = result && result[1];
    return src && src.replace(/\\/g, '');
  },

  siteName() {
    return 'Facebook';
  },

  themeColor() {
    return '#3b5998';
  }
});
