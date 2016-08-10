
/**
 * Dependencies
 */

var debug = require('debug')('magnet-html-parser:icon');
var URL = require('url');

/**
 * Exports
 */

module.exports = function($, { url, manifest }) {
  debug('parse icons', url, manifest);

  var icons = ((manifest && manifest.icons) || []).concat(
    parseNodes($('link[rel="apple-touch-icon"]'), $),
    parseNodes($('link[rel="apple-touch-icon-precomposed"]'), $),
    parseNodes($('link[rel="icon"]'), $),
    parseNodes($('link[rel="shortcut icon"]'), $))
    .sort((a, b) => parseInt(b.sizes, 10) - parseInt(a.sizes, 10));

  debug('sorted', icons);

  // choose the first icon
  if (icons.length > 0) return URL.resolve(url, icons[0].src);
};

/**
 * Utils
 */

function parseNodes($nodes, $) {
  if (!$nodes.length) return [];

  return $nodes.map((i, node) => {
    var $node = $(node);

    // console.log('XXX', {
    //   src: $node.attr('href'),
    //   sizes: $node.attr('sizes') || 0
    // });

    return {
      src: $node.attr('href'),
      sizes: $node.attr('sizes') || 0
    };
  }).get();
}
//
// function getIcons(selector, $, url) {
//   var nodes = $(selector);
//   var items = [];
//
//   if (!nodes.length) return items;
//
//   nodes.each((i, node) => {
//     var $node = $(node);
//     var href = $node.attr('href');
//     var sizes = $node.attr('sizes');
//     var color = $node.attr('color');
//     var result = {
//       href: URL.resolve(url, href)
//     };
//
//     if (sizes) result.size = $node.attr('sizes');
//     if (color) result.color = $node.attr('color');
//
//      // give each icon a 'score' based on its resolution
//     result.score = result.size ? parseInt(result.size, 10) : 0;
//
//     items.push(result);
//   });
//
//    // sort the results in descending order
//   items.sort((a, b) => a.score < b.score);
//
//   return items;
// }
