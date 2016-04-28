'use strict';

/**
 * Dependencies
 */

var joinUrl = require('../utils/join-url');
var debug = require('debug')('manifest');
var request = require('superagent');

/**
 * Exports
 */

module.exports = function($, url) {
  var manifestNode = $('link[rel="manifest"]');
  if (!manifestNode) return Promise.resolve({});

  var manifestUrl = manifestNode.attr('href');
  if (!manifestUrl) return Promise.resolve({});

  return fetchManifest(joinUrl(url, manifestUrl))
    .then(json => {
      debug('fetched manifest', json);
      var result = { manifest: json };

      if (json.name) result.title = json.name;
      if (json.short_name) result.short_name = json.short_name;
      if (json.theme_color) result.theme_color = json.theme_color;

      // icons
      if (json.icons && json.icons.length) {
        result.icons = formatIcons(json.icons, url);
        var bestIcon = pickIcon(result.icons);
        if (bestIcon) result.icon = bestIcon;
      }

      return result;
    })

    // fail silently
    .catch(err => console.error(err));
};

function fetchManifest(url) {
  return new Promise((resolve, reject) => {
    debug('fetch manifest', url);
    request
      .get(url)
      .end((err, result) => {
        if (err) return reject(err);
        resolve(result.body || JSON.parse(result.text));
      });
  });
}

function pickIcon(icons) {
  var last = icons[icons.length - 1];
  return last.src;
}

function formatIcons(icons, base) {
  return icons.map(icon => {
    icon.src = joinUrl(base, icon.src);
    return icon;
  });
}
