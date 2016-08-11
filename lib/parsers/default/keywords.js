
module.exports = function($, data) {
  var node = $('meta[name="keywords"]');
  var value = node.length && node.attr('content');

  if (value) {
    return value.split(',')
      .map(string => string.trim());
  }

  return [];
};
