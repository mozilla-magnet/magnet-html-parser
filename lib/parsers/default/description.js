
module.exports = function($, data) {
  var node = $('meta[property="og:description"]');
  var value = node.length && node.attr('content');
  if (value) return value.trim();

  node = $('meta[name="description"]');
  value = node.length && node.attr('content');
  if (value) return value.trim();
};
