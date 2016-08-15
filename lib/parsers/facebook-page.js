'use strict';

/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?\:\/\/?(?:www\.)?facebook\.com\/.+$/,

  title($, { jsonLd }) {
    var node = $('#fb-timeline-cover-name').first();
    if (node.length) return { value: node.text().trim() };
    if (jsonLd && jsonLd.name) return { value: jsonLd.name };
  },

  description($, { jsonLd }) {
    if (jsonLd && jsonLd.jobTitle && jsonLd.address && jsonLd.address.addressLocality) {
      return `${jsonLd.jobTitle}, ${jsonLd.address.addressLocality}`;
    }

    var node = $('meta[name="description"]').first();
    if (node.length) return { value: node.attr('content') };
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
