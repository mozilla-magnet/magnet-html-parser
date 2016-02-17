
/**
 * Dependencies
 */

var debug = require('debug')('parse');

var registery = {
  simple: require('./parsers/simple.js'),
  icon: require('./parsers/icon.js'),
  manifest: require('./parsers/manifest.js'),
  // require('./socialuser.js'),
  // require('./googleplay.js'),
  opengraph: require('./parsers/open-graph.js'),
  oembed: require('./parsers/oembed.js'),
  // require('./oembed-service.js'),
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

module.exports = function(doc, res, options) {
  debug('parsing', res.url);
  var parsers = (options && options.parsers) || all;
  var result = { url: res.url };
  return parsers.reduce((previous, name) => {
    return previous.then(result => {
      return registery[name](doc, res).then(data => {
        return Object.assign(result, data);
      });
    });
  }, Promise.resolve(result));
};
