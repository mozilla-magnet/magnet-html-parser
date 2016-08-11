'use strict';

/**
 * Dependencies
 */

var getManifest = require('./get-manifest');
var getJsonLd = require('./get-json-ld');
var getOembed = require('./get-oembed');
var cheerio = require('cheerio');

/**
 * Exports
 */

module.exports = DocumentParser;

function DocumentParser() {
  this.routes = [];
}

DocumentParser.prototype = {
  use(parser) {
    this.routes.push(parser);
    return this;
  },

  parse(html, url) {
    if (!html) return Promise.resolve(null);
    var parser = this.findParser(url);
    var $ = cheerio.load(html);

    return Promise.all([
      getManifest($, url),
      getOembed($, url),
      getJsonLd($)
    ]).then(result => {
      return this.runParser(parser, $, {
        manifest: result[0],
        oembed: result[1],
        jsonLd: result[2],
        url
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
      parser.type($, data)
    ]).then(result => {
      return {
        title: result[0],
        description: result[1],
        icon: result[2],
        image: result[3],
        keywords: result[4],
        themeColor: result[5],
        siteName: result[6],
        type: result[7],
        embed: data.oembed
      };
    });
  }
};
