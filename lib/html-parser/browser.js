
module.exports = function(html) {
  var doc = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = html;
  return doc;
};
