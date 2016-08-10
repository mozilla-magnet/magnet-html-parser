
module.exports = function($, { manifest }) {
  var node = $('meta[property="og:site_name"]');
  var value = node.length && node.attr('content');
  if (value) return value.trim();
  if (manifest) return manifest.name;
};
