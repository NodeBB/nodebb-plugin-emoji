const path = require('path');
const download = require('download');
const fromPairs = require('lodash.frompairs');
const semver = require('semver');
const emojionePackage = require('emojione/package.json');
const emoji = require('emojione/emoji');

const ver = semver.clean(emojionePackage.version, true);
const version = `${semver.major(ver)}.${semver.minor(ver)}`;

const packageURL = `https://d1j8pt39hxlh3d.cloudfront.net/emoji/emojione/${version}/EmojiOne_${version}_32x32_png.zip`;

function defineEmoji(data, callback) {
  download(packageURL, path.join(__dirname, 'emoji'), {
    extract: true,
  }).then(() => {
    const pairs = Object.keys(emoji).map((key) => {
      const e = emoji[key];

      const name = e.name.toLowerCase().replace(/[^a-z0-9-]+/g, '_');
      const aliases = [e.shortname, ...e.shortname_alternates].map(str => str.slice(1, -1));
      const ascii = e.ascii.map(x => x.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      const character = e.code_points.base
        .split('-')
        .map(code => String.fromCodePoint(parseInt(code, 16)))
        .join('');
      const categories = [e.category];

      return [name, {
        aliases,
        ascii,
        character,
        categories,
        image: `${key}.png`,
        keywords: e.keywords,
      }];
    });

    const dictionary = fromPairs(pairs);

    data.packs.push({
      path: __dirname,
      name: 'EmojiOne',
      id: 'emoji-one',
      attribution: 'Emoji icons provided free by <a href="https://www.emojione.com" target="_blank" rel="noopener">EmojiOne</a>',
      license: '<a href="https://d1j8pt39hxlh3d.cloudfront.net/license-free.pdf" target="_blank" rel="noopener">EmojiOne Free License</a>',
      mode: 'images',
      images: {
        directory: 'emoji',
      },
      dictionary,
    });

    callback(null, data);
  }, callback);
}

exports.defineEmoji = defineEmoji;
