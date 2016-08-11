# magnet-html-parser [![Build Status](https://travis-ci.org/mozilla-magnet/magnet-html-parser.svg?branch=master)](https://travis-ci.org/mozilla-magnet/magnet-html-parser)

> Extracts key document metadata from an HTML string.

```js
const parser = require('magnet-html-parser');
parser.parse(html, url).then(result => ...);
```

## Results

The parser will attempt to return the following metadata:

- `title` - A title of the page
- `description` - A description of the page
- `image` - An image that best represents this page
- `icon` - The site's icon
- `siteName` - The name of the site which this page belongs
- `themeColor` - A theme color of the site

> What metadata is returned completely depends on how the page is marked-up.
> We cannot guarantee any results.

## Adaptors

An adaptor is a custom parser that performs some specific metadata extraction
for a matched URL pattern. The library comes with some built in adaptors to
cope with some common sites, but you are able to add more.

```js
const parser = require('magnet-html-parser');
const adaptor = parser.adaptor;

parser.use(adaptor.extend({
  pattern: /example.com/,

  title() {
    var mainHeading = $('h1').first();
    return mainHeading.text();
  },

  description() {
    var firstParagraph = $('p').first();
    return firstParagraph.text();
  },

  image($, data) {
    return $('.main-image').attr('src');
  }

  ...
}));
```

> As you can 'extending' the base adaptor, you only need to define the
> properties you wish to customise, all other properties will be parsed
> using the default logic.
