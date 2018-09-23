import { readFile } from 'fs';
import { parallel } from 'async';

import { tableFile, aliasesFile, asciiFile, charactersFile } from './build';

const buster = require.main.require('./src/meta').config['cache-buster'];
const nconf = require.main.require('nconf');
const url = nconf.get('url');

let metaCache: {
  table: MetaData.table,
  aliases: MetaData.aliases,
  ascii: MetaData.ascii,
  asciiPattern: RegExp,
  characters: MetaData.characters,
  charPattern: RegExp,
} = null;
export function clearCache() {
  metaCache = null;
}

const escapeRegExpChars = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getTable = (callback: NodeBack<typeof metaCache>) => {
  if (metaCache) {
    callback(null, metaCache);
    return;
  }

  parallel({
    table: next => readFile(tableFile, 'utf8', next),
    aliases: next => readFile(aliasesFile, 'utf8', next),
    ascii: next => readFile(asciiFile, 'utf8', next),
    characters: next => readFile(charactersFile, 'utf8', next),
  }, (err: Error, results: {
    table: string,
    aliases: string,
    ascii: string,
    characters: string,
  }) => {
    if (err) {
      callback(err);
      return;
    }

    try {
      const ascii = JSON.parse(results.ascii);
      const asciiPattern = Object.keys(ascii)
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExpChars)
        .join('|');

      const characters = JSON.parse(results.characters);
      const charPattern = Object.keys(characters)
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExpChars)
        .join('|');

      metaCache = {
        ascii,
        characters,
        table: JSON.parse(results.table),
        aliases: JSON.parse(results.aliases),
        asciiPattern: asciiPattern ?
          new RegExp(`(^|\\s|\\n)(${asciiPattern})(?=\\n|\\s|$)`, 'g') :
          /(?!)/,
        charPattern: charPattern ?
          new RegExp(charPattern, 'g') :
          /(?!)/,
      };
    } catch (e) {
      callback(e);
      return;
    }

    callback(null, metaCache);
  });
};

const outsideCode = /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g;
const outsideElements = /(<[^>]*>)?([^<>]*)/g;
const emojiPattern = /:([a-z\-.+0-9_]+):/g;

export const buildEmoji = (emoji: StoredEmoji, whole: string) => {
  if (emoji.image) {
    const route = `${url}/plugins/nodebb-plugin-emoji/emoji/${emoji.pack}`;
    return `<img
      src="${route}/${emoji.image}?${buster}"
      class="not-responsive emoji emoji-${emoji.pack} emoji--${emoji.name}"
      title="${whole}"
      alt="${emoji.character}"
    />`;
  }

  return `<span
    class="emoji emoji-${emoji.pack} emoji--${emoji.name}"
    title="${whole}"
  ><span>${emoji.character}</span></span>`;
};

const replaceAscii = (str: string, { ascii, asciiPattern, table }: (typeof metaCache)) => {
  return str.replace(asciiPattern, (full: string, before: string, text: string) => {
    const emoji = ascii[text] && table[ascii[text]];
    if (emoji) {
      return `${before}${buildEmoji(emoji, text)}`;
    }

    return full;
  });
};

const replaceNative = (str: string, { characters, charPattern, table }: (typeof metaCache)) => {
  return str.replace(charPattern, (char: string) => {
    const name = characters[char];
    if (table[name]) {
      return `:${name}:`;
    }

    return char;
  });
};

interface ParseOptions {
  /** whether to parse ascii emoji representations into emoji */
  ascii?: boolean;
  native?: boolean;
}

const options: ParseOptions = {
  ascii: false,
  native: false,
};

export function setOptions(newOptions: ParseOptions) {
  Object.assign(options, newOptions);
}

const parse = (content: string, callback: NodeBack<string>) => {
  getTable((err, store) => {
    if (err) {
      callback(err);
      return;
    }
    const { table, aliases } = store;

    const parsed = content.replace(
      outsideCode,
      outsideCodeStr => outsideCodeStr.replace(outsideElements, (whole, inside, outside) => {
        let output = outside;

        if (options.native) {
          // avoid parsing native inside HTML tags
          // also avoid converting ascii characters
          output = output.replace(
            /(<[^>]+>)|([^0-9a-zA-Z`~!@#$%^&*()\-=_+{}|[\]\\:";'<>?,./\s\n]+)/g,
            (full: string, tag: string, text: string) => {
              if (text) {
                return replaceNative(text, store);
              }

              return full;
            },
          );
        }

        output = output.replace(emojiPattern, (whole: string, text: string) => {
          const name = text.toLowerCase();
          const emoji = table[name] || table[aliases[name]];

          if (emoji) {
            return buildEmoji(emoji, whole);
          }

          return whole;
        });

        if (options.ascii) {
          // avoid parsing native inside HTML tags
          output = output.replace(
            /(<[^>]+>)|([^<]+)/g,
            (full: string, tag: string, text: string) => {
              if (text) {
                return replaceAscii(text, store);
              }

              return full;
            },
          );
        }

        return (inside || '') + (output || '');
      }),
    );

    callback(null, parsed);
  });
};

export function raw(content: string, callback: NodeBack<string>) {
  parse(content, callback);
}

export function post(data: { postData: { content: string } }, callback: NodeBack) {
  parse(data.postData.content, (err, content: string) => {
    if (err) {
      callback(err);
      return;
    }

    data.postData.content = content;
    callback(null, data);
  });
}
