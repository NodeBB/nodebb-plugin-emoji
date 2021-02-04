const path = require('path');
const fromPairs = require('lodash.frompairs');
const emoji = require('emoji-datasource-apple/emoji');

function defineEmoji(data, callback) {
  const pairs = emoji.filter(e => e.has_img_apple).map((e) => {
    const name = e.short_name;
    const aliases = e.short_names.slice(1);
    const ascii = (e.texts || []).map(x => x.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    const character = e.unified
      .split('-')
      .map(code => String.fromCodePoint(parseInt(code, 16)))
      .join('');
    let category = e.category.toLowerCase();
    if (category === 'skin tones') { category = 'modifier'; } else if (category === 'foods') { category = 'food'; } else if (category === 'places') { category = 'travel'; }

    return [name, {
      aliases,
      ascii,
      character,
      categories: [category],
      keywords: e.keywords,
      image: e.image,
    }];
  });

  const dictionary = fromPairs(pairs);

  data.packs.push({
    name: 'Apple',
    id: 'apple',
    path: __dirname,
    attribution: 'From <a href="https://github.com/iamcal/emoji-data" target="_blank" rel="noopener">iamcal/emoji-data on Github</a>',
    license: 'Copyright © Apple Inc. License terms unknown. Use at own risk.',
    mode: 'images',
    images: {
      directory: path.join(path.dirname(require.resolve('emoji-datasource-apple')), 'img/apple/64'),
    },
    dictionary,
  });

  callback(null, data);
}

module.exports.defineEmoji = defineEmoji;
