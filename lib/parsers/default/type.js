'use strict';

module.exports = function($, { url }) {
  var node = $('meta[property="og:type"]');
  return node.length && node.attr('content');
};
