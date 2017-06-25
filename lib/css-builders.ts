import { basename } from 'path';

const nconf = require.main.require('nconf');
const url = nconf.get('url');

export function images(pack: EmojiDefinition) {
  return `.emoji-${pack.id} {` +
    'display: inline-block;' +
    'width: 20px;' +
    'height: 20px;' +
    'background-size: cover;' +
    'margin: -1px 0;' +
  '}';
}

export function sprite(pack: EmojiDefinition): string {
  const classes = Object.keys(pack.dictionary).map((name) => {
    return `.emoji-${pack.id}.${name} {` +
      `background-position: ${pack.dictionary[name]};` +
    '}';
  });

  const route = `${url}/plugins/nodebb-plugin-emoji/emoji/${pack.id}`;
  return `.emoji-${pack.id} {` +
    'display: inline-block;' +
    'width: 20px;' +
    'height: 20px;' +
    `background-image: url(${route}/${basename(pack.sprite.file)});` +
    `background-size: ${pack.sprite.backgroundSize};` +
    'margin: -1px 0;' +
  '}' +
  '.emoji-${pack.id} > span {' +
    'display: none;' +
  '}' + classes.join('');
}

export function font(pack: EmojiDefinition): string {
  const route = `${url}/plugins/nodebb-plugin-emoji/emoji/${pack.id}`;

  return '@font-face {' +
    `font-family: '${pack.font.family}';` +
    (pack.font.eot ? `src: url(${route}/${basename(pack.font.eot)});` : '') +
    'src: ' + [
      pack.font.eot &&
        `url(${route}/${basename(pack.font.eot)}?#iefix) format('embedded-opentype')`,
      pack.font.woff2 &&
        `url(${route}/${basename(pack.font.woff2)}) format('woff2')`,
      pack.font.woff &&
        `url(${route}/${basename(pack.font.woff)}) format('woff')`,
      pack.font.ttf &&
        `url(${route}/${basename(pack.font.ttf)}) format('truetype')`,
      pack.font.svg &&
        `url(${route}/${basename(pack.font.svg)}) format('svg')`,
    ].filter(Boolean).join(', ') + ';' +
  '}' +
  `.emoji-${pack.id} {` +
    `font-family: '${pack.font.family}';` +
    'display: inline-block;' +
    'font-size: 20px;' +
    'font-style: normal;' +
  '}';
}
