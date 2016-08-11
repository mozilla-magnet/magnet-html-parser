
module.exports = function($) {
  var node = $('script[type="application/ld+json"]');
  if (!node.length) return;
  try { return JSON.parse(node.first().text()); }
  catch (e) { return; }
};
