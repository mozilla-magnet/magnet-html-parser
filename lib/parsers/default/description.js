'use strict';

module.exports = function($, { fragment }) {
  var value = getFragmentDescription($, fragment);
  if (value) return value;

  var node = $('meta[property="og:description"]');
  value = node.length && node.attr('content');
  if (value) return value.trim();

  node = $('meta[name="description"]');
  value = node.length && node.attr('content');
  if (value) return value.trim();
};

function getFragmentDescription($, fragment) {
  if (!fragment) return;
  var parent = $(fragment);
  if (!parent.length) return;
  return findFirstText(parent, 'p');
}

function findFirstText(parent, selector) {
  var node = parent.find(selector).first();
  var text = node.length && node.text();
  return text && text.trim().replace(/\s\s+/g, ' ');
}
