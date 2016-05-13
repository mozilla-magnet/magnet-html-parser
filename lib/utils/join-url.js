
/**
 * Exports
 */

module.exports = function(base, path) {
  path = path.trim();

  // if absolute, we're all good
  if (startsWith(path, 'http')) return path;

  // string query params
  var firstQueryIndex = base.indexOf('?');
  if (firstQueryIndex > 7) base = base.slice(0, firstQueryIndex);

  // strip everything after last slash
  var lastSlashIndex = base.lastIndexOf('/');
  if (lastSlashIndex > 7) base = base.slice(0, lastSlashIndex);

  // ensure there's a slash dividing two parts
  if (!endsWith(base, '/') && !startsWith(path, '/')) base += '/';

  return base + path;
};

function startsWith(parent, child) {
  return parent.indexOf(child) === 0;
}

function endsWith(parent, child) {
  var index = parent.indexOf(child);
  return index > -1 && index === (parent.length - child.length);
}
