'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:default:title');

/**
 * Exports
 */

module.exports = function($, { scope }) {
  debug('parse', scope);

  var scoped = true;
  var value = getFragmentTitle($, scope);
  if (value) return { value, scoped };

  // no longer scoped
  scoped = false;

  var node = $('meta[property="og:title"]');
  value = node.length && node.attr('content');
  if (value) return { value, scoped };

  node = $('title');
  value = node.length && node.text();
  if (value) return { value, scoped };
};

function getFragmentTitle($, scope) {
  if (!scope) return;
  debug('found fragment');

  return findFirstText(scope, 'h1')
    || findFirstText(scope, 'h2')
    || findFirstText(scope, 'h3')
    || findFirstText(scope, 'h4')
    || findFirstText(scope, 'h5');
}

function findFirstText(parent, selector) {
  var node = parent.find(selector).first();
  var text = node.length && node.text();
  return text && text.trim().replace(/\s\s+/g, ' ');
}
