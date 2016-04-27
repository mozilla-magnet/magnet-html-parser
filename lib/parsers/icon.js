
module.exports = function($, url) {
  var result = {};
  var icons = [];

  function getIconsByType(selector) {
    var items = $(selector);
    if (!items.length) return [];

    items.each((i, node) => {
      var $node = $(node);
      var href = $node.attr('href');
      var sizes = $node.attr('sizes');
      var color = $node.attr('color');
      var result = {
        href: getIconUrl(url, href)
      };

      if (sizes) result.size = $node.attr('sizes');
      if (color) result.color = $node.attr('color');

      icons.push(result);
    });
  }

  // The primary app icon is prioritized
  // by these statements in reverse order.
  icons.concat(getIconsByType('link[rel="fluid-icon"]'));
  icons.concat(getIconsByType('link[rel="shortcut icon"]'));
  icons.concat(getIconsByType('link[rel="icon"]'));
  icons.concat(getIconsByType('link[rel="apple-touch-icon"]'));
  icons.concat(getIconsByType('link[rel="apple-touch-icon-precomposed"]'));

  if (icons.length > 0) {
    result.icons = icons;
    result.icon = icons[0].href;
  }

  return Promise.resolve(result);
};

/**
 * Utils
 */

function getIconUrl(url, icon) {
  if (icon.startsWith('http')) return icon;
  else if (icon.startsWith('//')) return 'http:' + icon;

  var lastSlashIndex = url.lastIndexOf('/');
  if (lastSlashIndex > 7) url = url.slice(0, lastSlashIndex);
  if (!icon.startsWith('/')) url += '/';

  return url + icon;
}
