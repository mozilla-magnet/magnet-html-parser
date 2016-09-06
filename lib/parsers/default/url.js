'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:default:url');

/**
 * Exports
 */

module.exports = function($, { url }) {
  debug('parse');
  return getAttr($, 'meta[name="magnet:url"]', 'content')
    // || getAttr($, 'meta[property="og:url"]', 'content')
    || url;
};

/**
 * Utils
 */

function getAttr($, selector, attr) {
  if (!selector) return;
  var node = $(selector).first();
  return node.length && node.attr(attr);
}
