'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:canonical-document');
const resolveUrl = require('url').resolve;
const request = require('superagent');
const config = require('../config');
const cheerio = require('cheerio');

/**
 * Exports
 */

module.exports = function(html, url) {
  var $ = cheerio.load(html);
  if (!config.fetchCanonical) return Promise.resolve({ $, url });

  var canonical = getLinkTagHref($);
  if (!canonical || canonical === url) return Promise.resolve({ $, url });

  var absolute = resolveUrl(url, canonical);
  debug('found canonical', absolute);

  return fetchHtml(absolute)
    .then(({ url, html }) => {
      return {
        $: cheerio.load(html),
        url
      };
    })

    .catch(e => {
      return { $, url };
    });
};

function getLinkTagHref($) {
  var node = $('link[rel="canonical"]');
  return node.length && node.attr('href');
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    debug('fetch canonical', url);
    request
      .get(url)
      .end((err, result) => {
        if (err) return reject(err);
        resolve({
          html: result.text,
          url: result.request.url
        });
      });
  });
}
