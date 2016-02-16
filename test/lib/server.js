
/**
 * Dependencies
 */

var express = require('express');

/**
 * Exports
 */

module.exports = Server;

function Server(dir, port) {
  this.app = express();
  this.app.use(express.static(dir));
  this.port = port;
  this.dir = dir;
}

Server.prototype = {
  start: function() {
    return new Promise(resolve => {
      this.server = this.app.listen(3333, resolve);
    });
  },

  stop: function() {
    this.server.close();
  }
};
