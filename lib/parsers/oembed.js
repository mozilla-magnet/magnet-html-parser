'use strict';

/**
 * Dependencies
 */

var parseXml = require('xml2js').parseString;
var debug = require('debug')('oembed');
var request = require('superagent');

/**
 * Exports
 */

module.exports = function($, url) {
  debug('find oembed');

  // json
  var jsonEmbed = $('link[type="application/json+oembed"]');
  if (jsonEmbed.length) return fetchJson(joinUrl(url, jsonEmbed.attr('href')))
    .then(done)
    .catch(() => {});

  // xml
  var xmlEmbed = $('link[type="text/xml+oembed"]');
  if (xmlEmbed.length) return fetchXml(joinUrl(url, xmlEmbed.attr('href')))
    .then(done);

  function done(data) {
    debug('got data', data);
    return data && { embed: data };
  }

  // not found
  return Promise.resolve({});
};

function joinUrl(base, path) {
  if (path.startsWith('http')) return path;
  var lastSlashIndex = base.lastIndexOf('/');
  if (lastSlashIndex > 7) base = base.slice(0, lastSlashIndex);
  if (!base.endsWith('/')) base += '/';
  return base + path;
}

function fetchJson(url) {
  debug('fetch json', url);
  return get(url)
    .then(result => result.body);
}

function fetchXml(url) {
  debug('fetch xml', url);

  return get(url)
    .then(result => {
      return new Promise((resolve, reject) => {
        parseXml(result.text, (err, result) => {
          if (err) return reject(err);
          resolve(result.oembed);
        });
      });
    })

    .then(data => {
      debug('parsed xml', data);
      if (!data) return;
      return Object.keys(data)
        .reduce((result, key) => {
          result[key] = data[key][0];
          return result;
        }, {});
    });
}

function get(url) {
  debug('get', url);
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .buffer()
      .end((err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
  });
}
