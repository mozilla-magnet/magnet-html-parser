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
        return fetchParse('title/title-tag.html')
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
        return fetchParse('title/title-tag-og-title.html')
          .then(result => {
            this.result = result;
          });
      });

      it('it uses the og:title', function() {
        assert.equal(this.result.title, 'the og title');
      });
    });

    describe('firefox', function() {
      beforeEach(function() {
        return fetchParse('title/dirty-title.html')
          .then(result => {
            this.result = result;
          });
      });

      it('it gets the title', function() {
        assert.equal(this.result.title, 'Browse Freely');
      });
    });
  });

  describe('.description', function() {
    describe('none', function() {
      beforeEach(function() {
        return fetchParse('description/none.html')
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
        return fetchParse('description/meta-description.html')
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
        return fetchParse('description/meta-description+og-description.html')
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
        return fetchParse('icon/none.html')
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
        return fetchParse('icon/apple-touch-icon.html')
          .then(result => {
            this.result = result;
          });
      });

      it('picks the largest apple-touch-icon', function() {
        assert.equal(this.result.icon, `http://localhost:${PORT}/apple-touch-icon-180x180.png`);
      });
    });

    describe('manifest', function() {
      beforeEach(function() {
        return fetchParse('icon/manifest')
          .then(result => {
            this.result = result;
          });
      });

      it('picks the largest manifest icon', function() {
        assert.equal(this.result.icon, `http://localhost:${PORT}/icon/manifest/images/touch/homescreen192.png`);
      });
    });
  });

  describe('.siteName', function() {
    describe('none', function() {
      beforeEach(function() {
        return fetchParse('site-name/none.html')
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
        return fetchParse('site-name/og-site-name.html')
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
        return fetchParse('site-name/manifest')
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
      return fetchParse('keywords/index.html')
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
        return fetchParse('icon/index.html')
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
        return fetchParse('icon/apple-touch-icon.html')
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
        return fetchParse('title/title-tag.html')
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
        return fetchParse('oembed/json/index.html')
          .then(result => this.result = result);
      });

      it('it parses the contents', function() {
        assert.ok(this.result.embed);
        assert.ok(this.result.embed.html);
      });
    });

    describe('xml', function() {
      beforeEach(function() {
        return fetchParse('oembed/xml/index.html')
          .then(result => this.result = result);
      });

      it('it parses the contents', function() {
        assert.ok(this.result.embed);
        assert.ok(this.result.embed.html);
      });
    });

    it('copes with query params on target url', function() {
      return fetchParse('oembed/json/index.html?url=http://google.com')
        .then(result => {
          assert.ok(result.embed);
          assert.ok(result.embed.html);
        });
    });
  });

  describe('.themeColor', function() {
    it('returns <meta> defined', function() {
      return fetchParse('theme-color/meta.html')
        .then(result => {
          assert.equal(result.themeColor, 'red');
        });
    });

    it('returns manifest defined', function() {
      return fetchParse('theme-color/manifest')
        .then(result => {
          assert.equal(result.themeColor, '#2196F3');
        });
    });
  });

  describe('.url', function() {
    describe('magnet:url', function() {
      beforeEach(function() {
        return fetchParse('url/magnet-url.html')
          .then(result => {
            this.result = result;
          });
      });

      it('uses the magnet:url', function() {
        assert.equal(this.result.url, 'http://magnet.com');
      });
    });

    describe.skip('og:url', function() {
      beforeEach(function() {
        return fetchParse('url/og-url.html')
          .then(result => {
            this.result = result;
          });
      });

      it('uses the og:url', function() {
        assert.equal(this.result.url, 'http://og.com');
      });
    });

    describe('none', function() {
      beforeEach(function() {
        return fetchParse('url/none.html')
          .then(result => {
            this.result = result;
          });
      });

      it('uses the passed url', function() {
        assert.equal(this.result.url, `http://localhost:${PORT}/url/none.html`);
      });
    });
  });

  describe('fragments', function() {
    describe('full', function() {
      beforeEach(function() {
        return fetchParse('fragments/index.html#aframe-workshop')
          .then(result => this.result = result);
      });

      it('flags that fragment parsing took place', function() {
        assert(this.result.scoped);
      });

      it('extracts a title', function() {
        assert.equal(this.result.title, 'Ada-Rose Edwards WORKSHOP: Bringing VR to the world via the web');
      });

      it('extracts a description', function() {
        assert.equal(this.result.description, 'Join us at this webVR workshop aimed at traditional web developers. This is an introduction to building Virtual Reality experiences for the Web, touching on the tools for creating assets for 3D VR scenes. The session will focus on A-Frame for composing 3D scenes in a fashion familiar to those used to building for the web.');
      });

      it('extracts an image', function() {
        assert.equal(this.result.image, `http://localhost:${PORT}/assets/images/speakers/adaroseedwards.jpg`);
      });
    });

    describe('without image', function() {
      beforeEach(function() {
        return fetchParse('fragments/index.html#sustainable-oss')
          .then(result => this.result = result);
      });

      it('extracts a title', function() {
        assert.equal(this.result.title, 'Sustainable Open-Source Projects');
      });

      it('falls back to the page image', function() {
        assert.equal(this.result.image, 'https://viewsourceconf.org/assets/images/berlin_facebook.jpg');
      });
    });

    // This test case is for a specific failure when the hash fragment is uri encoded
    describe('fragments with a ".%" character sequence', function() {
      beforeEach(function() {
        return fetchParse('fragments/index.html#12.%20fail')
          .then(result => this.result = result);
      });

      it('falls back to the whole page', function() {
        assert.equal(this.result.image, 'https://viewsourceconf.org/assets/images/berlin_facebook.jpg');
      });
    });
  });

  describe('canonical', function() {
    beforeEach(function() {
      return fetchParse('canonical/index.html')
        .then(result => this.result = result);
    });

    it('processes the canonical document', function() {
      assert.equal(this.result.title, 'canonical');
    });
  });

  /**
   * Utils
   */

  function fetchParse(path) {
    var url = `http://localhost:${PORT}/${path}`;
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, result) => {
          if (err) reject(err);
          parser.parse(result.text, result.request.url)
            .then(resolve, reject);
        });
    });
  }
});
