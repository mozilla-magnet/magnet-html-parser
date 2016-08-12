'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:default:image');
const resolveUrl = require('url').resolve;

/**
 * Exports
 */

module.exports = function($, { url, fragment }) {
  debug('parse', url, fragment);

  var src = get($, fragment);
  return src && resolveUrl(url, src);
};

function get($, fragment) {
  var value = getFragmentImage($, fragment);
  if (value) return value;

  var node = $('meta[property="og:image"]');
  value = node.length && node.attr('content');
  if (value) return value;

  node = $('meta[name="twitter:image"]');
  value = node.length && node.attr('content');
  return value;
}

function getFragmentImage($, fragment) {
  if (!fragment) return;
  var parent = $(fragment);
  if (!parent.length) return;
  var node = parent.find('img');
  return node.length && node.attr('src');
}
