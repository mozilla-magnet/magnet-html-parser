'use strict';

/**
 * Dependencies
 */

var resolveUrl = require('url').resolve;
var parser = require('./default');

module.exports = parser.extend({
  pattern: /^https?\:\/\/?(?:www\.)?facebook\.com\/.+$/,

  title($) {
    var node = $('#fb-timeline-cover-name');
    if (node.length) return node.first().text().trim();

    var json = parseJson($);
    return json && json.name;
  },

  description($) {
    var json = parseJson($);

    if (json && json.jobTitle && json.address && json.address.addressLocality) {
      return `${json.jobTitle}, ${json.address.addressLocality}`;
    }

    var node = $('meta[name="description"]');
    return node.length && node.attr('content');
  },

  image($, { url }) {
    var node = $('.profilePic');
    var src = node.length && node.attr('src');
    if (src) return resolveUrl(url, src);

    node = $('body script').eq(0);
    src = node.length && node.html().match(/coverPhotoData.+?uri":"([^"]+)/)[1];
    return src && src.replace(/\\/g, '');
  },

  siteName() {
    return 'Facebook';
  },

  themeColor() {
    return '#3b5998';
  },

  type($) {
    var json = parseJson($);
    return json && json['@type'];
  }
});

/**
 * Utils
 */

function parseJson($) {
  var node = $('[type="application/ld+json"]');
  if (!node.length) return result;

  try {
    return JSON.parse(node.text());
  } catch (err) { return result; }
}
