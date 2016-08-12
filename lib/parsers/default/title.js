'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:default:title');

/**
 * Exports
 */

module.exports = function($, { fragment }) {
  debug('parse', fragment);

  var value = getFragmentTitle($, fragment);
  if (value) return value;

  var node = $('meta[property="og:title"]');
  value = node.length && node.attr('content');
  if (value) return value;

  node = $('title');
  value = node.length && node.text();
  if (value) return value;
};

function getFragmentTitle($, fragment) {
  if (!fragment) return;
  var parent = $(fragment);
  if (!parent.length) return;
  debug('found fragment');

  return findFirstText(parent, 'h1')
    || findFirstText(parent, 'h2')
    || findFirstText(parent, 'h3')
    || findFirstText(parent, 'h4')
    || findFirstText(parent, 'h5');
}

function findFirstText(parent, selector) {
  var node = parent.find(selector).first();
  var text = node.length && node.text();
  return text && text.trim().replace(/\s\s+/g, ' ');
}
