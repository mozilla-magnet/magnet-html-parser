'use strict';

/**
 * Dependencies
 */

var debug = require('debug')('magnet-html-parser:manifest');
var request = require('superagent');
var URL = require('url');

/**
 * Exports
 */

module.exports = function($, url) {
  var manifestNode = $('link[rel="manifest"]');
  if (!manifestNode) return Promise.resolve({});

  var manifestUrl = manifestNode.attr('href');
  if (!manifestUrl) return Promise.resolve({});
  manifestUrl = URL.resolve(url, manifestUrl);

  return fetchManifest(manifestUrl)
    .then(manifest => {
      debug('fetched manifest', manifest);
      manifest.icons = processIcons(manifest.icons, manifestUrl);
      return manifest;
    })

    // fail silently
    .catch(err => {
      console.error(err); // eslint-disable-line no-console
    });
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

function processIcons(icons, base) {
  if (!icons) return [];
  return icons.map(icon => {
    icon.src = URL.resolve(base, icon.src);
    return icon;
  }).sort((a, b) => parseInt(a, 10) > parseInt(b, 10));
}
