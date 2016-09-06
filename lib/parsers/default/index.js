
exports = module.exports = {
  pattern: /./,
  url: require('./url'),
  title: require('./title'),
  description: require('./description'),
  image: require('./image'),
  icon: require('./icon'),
  keywords: require('./keywords'),
  themeColor: require('./theme-color'),
  siteName: require('./site-name'),
  type: require('./type')
};

exports.extend = function(props) {
  var child = Object.create(this);

  for (var key in props) {
    if (!props.hasOwnProperty(key)) return;
    if (!exports.hasOwnProperty(key)) throw new Error(`unsupported key: ${key}`);
    if (key !== 'pattern' && typeof props[key] !== 'function') throw new Error(`method function: ${key}`);
    child[key] = props[key];
  }

  return child;
};
