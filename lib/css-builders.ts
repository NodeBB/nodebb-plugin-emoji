import { basename } from 'path';

const nconf = require.main.require('nconf');
const url = nconf.get('url');

export function images(pack: EmojiDefinition) {
  return `.emoji-${pack.id} {` +
    'display: inline-block;' +
    'height: 23px;' +
  '}';
}

export function sprite(pack: EmojiDefinition): string {
  const classes = Object.keys(pack.dictionary).map((name) => {
    return `.emoji-${pack.id}.emoji--${name} {` +
      `background-position: ${pack.dictionary[name].backgroundPosition};` +
    '}';
  });

  const route = `${url}/plugins/nodebb-plugin-emoji/emoji/${pack.id}`;
  return `.emoji-${pack.id} {` +
    `background-image: url(${route}/${basename(pack.sprite.file)});` +
    `background-size: ${pack.sprite.backgroundSize};` +
    'background-repeat: no-repeat;' +
    'display: inline-block;' +
    'height: 23px;' +
    'width: 23px;' +
    'overflow: hidden;' +
    'font-size: 23px;' +
    'line-height: 23px;' +
    'text-align: center;' +
    'vertical-align: bottom;' +
    'color: transparent;' +
  '}' +
  `.emoji-link .emoji-${pack.id} {` +
    'transform: scale(1.304347826086957);' +
    'position: relative;' +
    'bottom: -3.5px;' +
    'height: 23px;' +
    'width: 23px;' +
    'font-size: 23px;' +
    'line-height: 23px;' +
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
    'font-style: normal;' +
    'display: inline-block;' +
    'height: 23px;' +
    'width: 23px;' +
    'overflow: hidden;' +
    'font-size: 23px;' +
    'line-height: 23px;' +
    'text-align: center;' +
    'vertical-align: bottom;' +
  '}';
}
