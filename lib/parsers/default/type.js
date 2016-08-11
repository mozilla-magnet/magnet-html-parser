'use strict';

module.exports = function($, data) {
  var type = get($, data);
  return type && type.trim();
};

function get($, { url, jsonLd }) {
  // json-ld
  if (jsonLd && jsonLd['@type']) return jsonLd['@type'];

  // microdata
  var node = $('[itemscope][itemtype]');
  if (node.length) return node.attr('itemtype').replace(/https?:\/\/schema.org\//, '');

  // open-graph
  node = $('meta[property="og:type"]');
  return node.length && normalize(node.attr('content'));
}

/**
 * Attempt to normalize to schema.org type.
 *
 * @param  {String} type
 * @return {String}
 */
function normalize(type) {
  return openGraphToSchema[type] || type;
}

const openGraphToSchema = {
  'article': 'Article',
  'book': 'Book',
  'profile': 'ProfilePage',
  'company': 'Organization',
  'music.song': 'MusicComposition',
  'music.album': 'MusicAlbum',
  'music.playlist': 'MusicPlaylist',
  'music.radio_station': 'RadioStation',
  'video.movie': 'Movie',
  'video.episode': 'Episode',
  'website': 'WebSite'
};
