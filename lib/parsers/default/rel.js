'use strict';

module.exports = function(relType) {
  return function($, data) {
    const nodes = $(`[rel="${relType}"]`);
    const result = nodes.map((_, el) => $(el).attr('href')).get();
    return result;
  };
}
