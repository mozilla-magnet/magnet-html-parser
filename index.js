
/**
 * Dependencies
 */

var DocumentParser = require('./lib/document-parser');

module.exports = new DocumentParser()
  .use(require('./lib/parsers/twitter-profile'))
  .use(require('./lib/parsers/facebook-page'))
  .use(require('./lib/parsers/wikipedia-article'))
  .use(require('./lib/parsers/view-source-speaker'))
  .use(require('./lib/parsers/default'));
