'use strict';

/**
 * Dependencies
 */

var Server = require('./lib/server');
var request = require('superagent');
var assert = require('assert');
var parser = require('..');

/**
 * Port to run the local test server on.
 *
 * @type {Number}
 */
const PORT = 4000;

/**
 * Tests
 */

describe('magnet-parser', function() {
  before(function() {
    this.server = new Server(`${__dirname}/apps`, PORT);
    return this.server.start();
  });

  after(function() {
    this.server.stop();
  });

  describe('.title', function() {
    describe('<title>', function() {
      beforeEach(function() {
        return fetchLocal('title/title-tag.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the <title>', function() {
        assert.equal(this.result.title, 'title');
      });
    });

    describe('og:title', function() {
      beforeEach(function() {
        return fetchLocal('title/title-tag-og-title.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the og:title', function() {
        assert.equal(this.result.title, 'the og title');
      });
    });
  });

  describe('.description', function() {
    describe('none', function() {
      beforeEach(function() {
        return fetchLocal('description/none.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it is undefined', function() {
        assert.equal(this.result.siteName, undefined);
      });
    });

    describe('<meta name="description">', function() {
      beforeEach(function() {
        return fetchLocal('description/meta-description.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the meta description', function() {
        assert.equal(this.result.description, 'description');
      });
    });

    describe('og:description', function() {
      beforeEach(function() {
        return fetchLocal('description/meta-description+og-description.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the og description', function() {
        assert.equal(this.result.description, 'og description');
      });
    });
  });

  describe('.icon', function() {
    describe('none', function() {
      beforeEach(function() {
        return fetchLocal('icon/none.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('is undefined', function() {
        assert.equal(this.result.icon, undefined);
      });
    });

    describe('apple-touch-icon', function() {
      beforeEach(function() {
        return fetchLocal('icon/apple-touch-icon.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it picks the largest apple-touch-icon', function() {
        assert.equal(this.result.icon, `http://localhost:${PORT}/apple-touch-icon-180x180.png`);
      });
    });

    describe('manifest', function() {
      beforeEach(function() {
        return fetchLocal('icon/manifest')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it picks the largest manifest icon', function() {
        assert.equal(this.result.icon, `http://localhost:${PORT}/icon/manifest/images/touch/homescreen192.png`);
      });
    });
  });

  describe('.siteName', function() {
    describe('none', function() {
      beforeEach(function() {
        return fetchLocal('site-name/none.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it is undefined', function() {
        assert.equal(this.result.siteName, undefined);
      });
    });

    describe('og:site_name', function() {
      beforeEach(function() {
        return fetchLocal('site-name/og-site-name.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the og:site_name', function() {
        assert.equal(this.result.siteName, 'og site name');
      });
    });

    describe('manifest', function() {
      beforeEach(function() {
        return fetchLocal('site-name/manifest')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the manifest site-name', function() {
        assert.equal(this.result.siteName, 'manifest site name');
      });
    });
  });

  describe('.keywords', function() {
    beforeEach(function() {
      return fetchLocal('keywords/index.html')
        .then(result => parser.parse(result.html, result.url))
        .then(result => {
          this.result = result;
        });
    });

    it('it returns a list of keywords', function() {
      assert.deepEqual(this.result.keywords, [
        'magnet',
        'best',
        'physical web',
        'client'
      ]);
    });
  });

  describe('.icon', function() {
    describe('bbc', function() {
      beforeEach(function() {
        return fetchLocal('icon/index.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it returns the icon', function() {
        assert.equal(this.result.icon, 'http://static.bbci.co.uk/news/1.111.16/apple-touch-icon.png');
      });
    });

    describe('apple-touch-icon', function() {
      beforeEach(function() {
        return fetchLocal('icon/apple-touch-icon.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it returns the icon', function() {
        assert.equal(this.result.icon, `http://localhost:${PORT}/apple-touch-icon-180x180.png`);
      });
    });
  });

  describe('.embed', function() {
    describe('none', function() {
      beforeEach(function() {
        return fetchLocal('title/title-tag.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('returns `undefined`', function() {
        assert.equal(this.result.embed, undefined);
      });
    });

    describe('json', function() {
      beforeEach(function() {
        return fetchLocal('oembed/json/index.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it parses the contents', function() {
        assert.ok(this.result.embed);
        assert.ok(this.result.embed.html);
      });
    });

    describe('xml', function() {
      beforeEach(function() {
        return fetchLocal('oembed/xml/index.html')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('it parses the contents', function() {
        assert.ok(this.result.embed);
        assert.ok(this.result.embed.html);
      });
    });

    it('copes with query params on target url', function() {
      return fetchLocal('oembed/json/index.html?url=http://google.com')
        .then(result => parser.parse(result.html, result.url))
        .then(result => {
          assert.ok(result.embed);
          assert.ok(result.embed.html);
        });
    });
  });

  describe('.themeColor', function() {
    it('returns <meta> defined', function() {
      return fetchLocal('theme-color/meta.html')
        .then(result => parser.parse(result.html, result.url))
        .then(result => {
          assert.equal(result.themeColor, 'red');
        });
    });

    it('returns manifest defined', function() {
      return fetchLocal('theme-color/manifest')
        .then(result => parser.parse(result.html, result.url))
        .then(result => {
          assert.equal(result.themeColor, '#2196F3');
        });
    });
  });

  /**
   * Utils
   */

  function fetchLocal(app) {
    return fetch(`http://localhost:${PORT}/${app}`);
  }

  function fetch(url) {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, result) => {
          if (err) reject(err);
          resolve({
            html: result.text,
            url: result.res.url || result.request.url
          });
        });
    });
  }
});
