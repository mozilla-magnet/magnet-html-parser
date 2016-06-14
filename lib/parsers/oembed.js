'use strict';

/**
 * Dependencies
 */

var parseXml = require('xml2js').parseString;
var debug = require('debug')('oembed');
var request = require('superagent');
var URL = require('url');

/**
 * Exports
 */

module.exports = function($, url) {
  debug('find oembed');

  // json
  var jsonEmbed = $('link[type="application/json+oembed"]');
  if (jsonEmbed.length) return fetchJson(URL.resolve(url, jsonEmbed.attr('href')))
    .then(done)
    .catch(() => {});

  // xml
  var xmlEmbed = $('link[type="text/xml+oembed"]');
  if (xmlEmbed.length) return fetchXml(URL.resolve(url, xmlEmbed.attr('href')))
    .then(done);

  function done(data) {
    debug('got data', data);
    return data && { embed: data };
  }

  // not found
  return Promise.resolve({});
};

function fetchJson(url) {
  debug('fetch json', url);
  return get(url)
    .then(result => {
      debug('result');
      if (result.body && result.body.html) return result.body;
      try {
        return JSON.parse(result.text);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    })

    .catch(err => console.error(err)); // eslint-disable-line no-console
}

function fetchXml(url) {
  debug('fetch xml', url);

  return get(url)
    .then(result => {
      return new Promise((resolve, reject) => {
        if (!result.text) return resolve();
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
    var req = request.get(url);

    // We must call .buffer() for XML
    // requests to succeed. But for
    // some reason .buffer() isn't
    // always defined in browser.
    if (req.buffer) req.buffer();

    req.end((err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
