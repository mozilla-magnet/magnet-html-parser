
module.exports = function($, data) {
  var node = $('meta[property="og:title"]');
  var value = node.length && node.attr('content');
  if (value) return value;

  node = $('title');
  value = node.length && node.text();
  if (value) return value;
};
