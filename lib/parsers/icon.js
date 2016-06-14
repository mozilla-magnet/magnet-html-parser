'use strict';

/**
 * Dependencies
 */

var debug = require('debug')('icon');
var URL = require('url');

/**
 * Exports
 */

module.exports = function($, url) {
  debug('parse icons', url);
  var result = {};
  var icons = [];

  // ordered by priority
  icons = icons.concat(getIcons('link[rel="apple-touch-icon"]', $, url));
  icons = icons.concat(getIcons('link[rel="apple-touch-icon-precomposed"]', $, url));
  icons = icons.concat(getIcons('link[rel="icon"]', $, url));
  icons = icons.concat(getIcons('link[rel="fluid-icon"]', $, url));
  icons = icons.concat(getIcons('link[rel="shortcut icon"]', $, url));
  icons = icons.concat(getIcons('link[rel="mask-icon"]', $, url));

  // choose the first icon
  if (icons.length > 0) {
    result.icons = icons;
    result.icon = icons[0].href;
  }

  debug('result', result);
  return Promise.resolve(result);
};

/**
 * Utils
 */

function getIcons(selector, $, url) {
  var nodes = $(selector);
  var items = [];

  if (!nodes.length) return items;

  nodes.each((i, node) => {
    var $node = $(node);
    var href = $node.attr('href');
    var sizes = $node.attr('sizes');
    var color = $node.attr('color');
    var result = {
      href: URL.resolve(url, href)
    };


    if (sizes) result.size = $node.attr('sizes');
    if (color) result.color = $node.attr('color');

     // give each icon a 'score' based on its resolution
    result.score = result.size ? parseInt(result.size, 10) : 0;

    items.push(result);
  });

   // sort the results in descending order
  items.sort((a, b) => a.score < b.score);

  return items;
}
