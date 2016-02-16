
module.exports = function(doc, res) {
  var result = {};
  var icons = [];

  function getIconsByType(selector) {
    var items = [].slice.call(doc.querySelectorAll(selector));

    if (!items.length) return [];

    items.forEach((node) => {
      var result = { href: getIconUrl(res.url, node.href) };

      if (node.getAttribute('sizes')) {
        result.size = node.getAttribute('sizes');
      }

      if (node.getAttribute('color')) {
        result.color = node.getAttribute('color');
      }

      icons.push(result);
    });
  }

  // The primary app icon is prioritized
  // by these statements in reverse order.
  icons.concat(getIconsByType('link[rel="mask-icon"]'));
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
  if (icon.startsWith('http')) {
    return icon;
  } else if (icon.startsWith('//')) {
    return 'http:' + icon;
  }

  var lastSlashIndex = url.lastIndexOf('/');
  if (lastSlashIndex > 7) {
    url = url.slice(0, lastSlashIndex);
  }

  if (!icon.startsWith('/')) {
    url += '/';
  }

  return url + icon;
}
