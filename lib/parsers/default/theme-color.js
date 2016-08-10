
module.exports = function($, { manifest }) {
  var node = $('meta[name="theme-color"]');
  var value = node.length && node.attr('content');
  if (value) return value.trim();
  if (manifest) return manifest.theme_color;
};
