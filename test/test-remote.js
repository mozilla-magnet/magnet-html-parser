/*global describe,test,setup,suiteSetup,suiteTeardown*/

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
  this.timeout(10000);

  before(function() {
    this.server = new Server(`${__dirname}/apps`, PORT);
    return this.server.start();
  });

  after(function() {
    this.server.stop();
  });

  describe('facebook', function() {
    describe('person', function() {
      before(function() {
        return fetch('https://facebook.com/wilson.page')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('uses the persons name as title', function() {
        assert.equal(this.result.title, 'Wilson Page');
      });

      it('uses job title and location as description', function() {
        assert.equal(this.result.description, 'Front End Engineer, London, United Kingdom');
      });

      it('has an image', function() {
        assert.ok(this.result.image);
      });

      it('has person type', function() {
        assert.equal(this.result.type, 'Person');
      });
    });

    describe('organization', function() {
      before(function() {
        return fetch('https://facebook.com/mozilla')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('uses the organization name as title', function() {
        assert.equal(this.result.title, 'Mozilla');
      });

      it('has an image', function() {
        assert.equal(this.result.image, 'https://scontent.xx.fbcdn.net/t31.0-8/10623711_10152774291972381_7097908318373997095_o.jpg');
      });

      it('has person type', function() {
        assert.equal(this.result.type, 'Organization');
      });
    });
  });

  describe('twitter', function() {
    before(function() {
      return fetch('https://twitter.com/wilsonpage')
        .then(result => parser.parse(result.html, result.url))
        .then(result => {
          this.result = result;
        });
    });

    it('uses the persons name as title', function() {
      assert.equal(this.result.title, 'Wilson Page');
    });

    it('uses twitter bio as description', function() {
      assert.equal(this.result.description, 'Front-end developer @mozilla. Previously @ftlabs. Web applications, web-components, performance, architecture.');
    });

    it('has an image', function() {
      assert.ok(this.result.image);
      assert.ok(this.result.image.startsWith('http'), 'image url is absolute');
    });

    it('has ProfilePage type', function() {
      assert.equal(this.result.type, 'ProfilePage');
    });
  });

  describe('wikipedia', function() {
    describe('article-1', function() {
      before(function() {
        return fetch('https://en.wikipedia.org/wiki/Mozilla')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('uses the article title as title', function() {
        assert.equal(this.result.title, 'Mozilla');
      });

      it('uses has a description', function() {
        assert.ok(this.result.description);
      });

      it('has an image', function() {
        assert.ok(this.result.image);
        assert.ok(this.result.image.startsWith('http'), 'image url is absolute');
      });

      it('has Article type', function() {
        assert.equal(this.result.type, 'Article');
      });
    });

    describe('article-2', function() {
      before(function() {
        return fetch('https://en.wikipedia.org/wiki/Ramsay_MacDonald')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('uses the article title as title', function() {
        assert.equal(this.result.title, 'Ramsay MacDonald');
      });

      it('uses has a description', function() {
        assert.ok(this.result.description);
      });

      it('has an image', function() {
        assert.ok(this.result.image);
      });

      it('has Article type', function() {
        assert.equal(this.result.type, 'Article');
      });
    });

    describe('view-source-speaker', function() {
      before(function() {
        return fetch('https://viewsourceconf.org/berlin-2016/speakers/jen-simmons/')
          .then(result => parser.parse(result.html, result.url))
          .then(result => {
            this.result = result;
          });
      });

      it('uses the persons name as title', function() {
        assert.equal(this.result.title, 'Jen Simmons');
      });

      it('uses twitter bio as description', function() {
        assert.equal(this.result.description, 'Dubbed “the Terry Gross of the tech industry,” Jen Simmons is the host and executive producer of The Web Ahead. Her in-depth interviews explain emerging technology and predict the future of the web — and won the 2015 Net Award for Podcast of the Year.');
      });

      it('has an image', function() {
        assert.ok(this.result.image);
        assert.ok(this.result.image.startsWith('http'), 'image url is absolute');
      });

      it('has Person type', function() {
        assert.equal(this.result.type, 'Person');
      });
    });
  });

  describe('google-play-app', function() {
    before(function() {
      return fetch('https://play.google.com/store/apps/details?id=org.mozilla.firefox')
        .then(result => parser.parse(result.html, result.url))
        .then(result => {
          this.result = result;
        });
    });

    it('has correct title', function() {
      assert.equal(this.result.title, 'Firefox Browser fast & private');
    });

    it('has correct description', function() {
      assert.equal(this.result.description, 'Experience a fast, smart and personal Web. Firefox is the independent, people-first browser made by Mozilla, voted the Most Trusted Internet Company for Privacy. Upgrade today and join hundreds of millions who depend on Firefox for a more personal browsing experience.');
    });

    it('has an image', function() {
      assert.ok(this.result.image);
      assert.ok(this.result.image.startsWith('http'), 'image url is absolute');
    });

    it('has correct type', function() {
      assert.equal(this.result.type, 'MobileApplication');
    });
  });

  /**
   * Utils
   */

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
