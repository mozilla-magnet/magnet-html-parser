'use strict';

/**
 * Dependencies
 */

var debug = require('debug')('parse');

var registry = {
  simple: require('./parsers/simple.js'),
  icon: require('./parsers/icon.js'),
  manifest: require('./parsers/manifest.js'),
  opengraph: require('./parsers/open-graph.js'),
  oembed: require('./parsers/oembed.js')
};

var all = [
  'simple',
  'icon',
  'manifest',
  'opengraph',
  'oembed'
];

/**
 * Exports
 */

module.exports = function($, url, options) {
  debug('parsing', url);
  var parsers = (options && options.parsers) || all;
  var result = { url: url };
  return parsers.reduce((previous, name) => {
    return previous.then(result => {
      return registry[name]($, url).then(data => {
        return Object.assign(result, data);
      });
    });
  }, Promise.resolve(result));
};
