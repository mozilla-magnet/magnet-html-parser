'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:default:image');
const resolveUrl = require('url').resolve;

/**
 * Exports
 */

module.exports = function($, { url, scope }) {
  debug('parse', url, scope);

  var src = get($, scope);
  return src && resolveUrl(url, src.value);
};

function get($, scope) {
  var scoped = true;
  var value = getFragmentImage($, scope);
  if (value) return { value, scoped };

  // no longer scoped
  scoped = false;

  var node = $('meta[property="og:image"]');
  value = node.length && node.attr('content');
  if (value) return { value, scoped };

  node = $('meta[name="twitter:image"]');
  value = node.length && node.attr('content');
  if (value) return { value, scoped };
}

function getFragmentImage($, scope) {
  if (!scope) return;
  var node = scope.find('img');
  return node.length && node.attr('src');
}
