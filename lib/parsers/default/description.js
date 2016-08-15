'use strict';

module.exports = function($, { scope }) {
  var scoped = true;
  var value = getFragmentDescription($, scope);
  if (value) return { value, scoped };

  // no longer scoped
  scoped = false;

  var node = $('meta[property="og:description"]');
  value = node.length && node.attr('content');
  if (value) return { value: value.trim(), scoped };

  node = $('meta[name="description"]');
  value = node.length && node.attr('content');
  if (value) return { value: value.trim(), scoped };
};

function getFragmentDescription($, scope) {
  if (!scope) return;
  return findFirstText(scope, 'p');
}

function findFirstText(parent, selector) {
  var node = parent.find(selector).first();
  var text = node.length && node.text();
  return text && text.trim().replace(/\s\s+/g, ' ');
}
