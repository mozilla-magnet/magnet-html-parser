'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('magnet-html-parser:document-parser');
const parseCanonicalDocument = require('./parse-canonical-document');
const getManifest = require('./get-manifest');
const getJsonLd = require('./get-json-ld');
const getOembed = require('./get-oembed');
const config = require('../config');
const URL = require('url');

/**
 * Exports
 */

module.exports = DocumentParser;

function DocumentParser() {
  this.routes = [];
}

DocumentParser.prototype = {
  use(parser) {
    debug('use', parser.pattern);
    this.routes.push(parser);
    return this;
  },

  parse(html, url) {
    debug('parse');
    if (!html) return Promise.resolve(null);
    const fragment = getFragment(url);

    return parseCanonicalDocument(html, url)
      .then(({ $, url }) => {
        debug('parsing document', url);
        const parser = this.findParser(url);
        const scope = getScope($, fragment);

        return Promise.all([
          getManifest($, url),
          getOembed($, url),
          getJsonLd($)
        ]).then(result => {
          return this.runParser(parser, $, {
            manifest: result[0],
            oembed: result[1],
            jsonLd: result[2],
            scope,
            url
          });
        });
      });
  },

  findParser(url) {
    for (var i = 0; i < this.routes.length; i++) {
      if (this.routes[i].pattern.test(url)) return this.routes[i];
    }
  },

  runParser(parser, $, data) {
    return Promise.all([
      parser.title($, data),
      parser.description($, data),
      parser.icon($, data),
      parser.image($, data),
      parser.keywords($, data),
      parser.themeColor($, data),
      parser.siteName($, data),
      parser.type($, data),
      parser.url($, data)
    ]).then(result => {
      debug('parsed', result);
      const title = result[0];
      const description = result[1];
      const image = result[3];

      // test if the result was fetched from a scoped subtree
      const scoped = ((title && title.scoped)
        || (description && description.scoped)
        || (image && image.scoped));

      return {
        title: getValue(title),
        description: getValue(description),
        icon: getValue(result[2]),
        image: getValue(image),
        keywords: getValue(result[4]),
        themeColor: getValue(result[5]),
        siteName: getValue(result[6]),
        type: getValue(result[7]),
        url: getValue(result[8]),
        embed: data.oembed,
        scoped
      };
    });
  }
};

/**
 * Utils
 */

function getFragment(url) {
  if (!config.fragments) return;
  return URL.parse(url).hash;
}

function getScope($, fragment) {
  try {
    var node = $(fragment);
    return node.length ? node : null;
  } catch (e) {
    return null;
  }
}

function getValue(result) {
  return result && (result.value || result);
}
