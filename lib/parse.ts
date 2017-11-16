import { readFile } from 'fs';
import { join } from 'path';
import { parallel } from 'async';

import { tableFile, aliasesFile, asciiFile, charactersFile } from './build';

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
    table: next => readFile(tableFile, next),
    aliases: next => readFile(aliasesFile, next),
    ascii: next => readFile(asciiFile, next),
    characters: next => readFile(charactersFile, next),
  }, (err: Error, results) => {
    if (err) {
      callback(err);
      return;
    }

    try {
      const ascii = JSON.parse(results.ascii.toString());
      const asciiPattern = Object.keys(ascii)
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExpChars)
        .join('|');

      const characters = JSON.parse(results.characters.toString());
      const charPattern = Object.keys(characters)
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExpChars)
        .join('|');

      metaCache = {
        ascii,
        characters,
        table: JSON.parse(results.table.toString()),
        aliases: JSON.parse(results.aliases.toString()),
        asciiPattern: new RegExp(`(?:^|\\s)(${asciiPattern})(?=\\s|$)`, 'g'),
        charPattern: new RegExp(charPattern, 'g'),
      };
    } catch (e) {
      callback(e);
      return;
    }
    
    callback(null, metaCache);
  });
};

const outsideCode = /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g;
const emojiPattern = /:([a-z\-.+0-9_]+):/g;

const buildEmoji = (emoji: StoredEmoji, whole: string) => {
  if (emoji.image) {
    const route = `${url}/plugins/nodebb-plugin-emoji/emoji/${emoji.pack}`;
    return `<img
      src="${route}/${emoji.image}"
      class="not-responsive emoji-${emoji.pack} emoji--${emoji.name}"
      title="${whole}"
      alt="${emoji.character}"
    />`;
  }

  return `<span
    class="emoji-${emoji.pack} emoji--${emoji.name}"
    title="${whole}"
  ><span>${emoji.character}</span></span>`;
};

const replaceAscii = (str: string, { ascii, asciiPattern, table }: (typeof metaCache)) => {
  return str.replace(asciiPattern, (full: string, text: string) => {
    const emoji = ascii[text] && table[ascii[text]];
    if (emoji) {
      return full.replace(text, buildEmoji(emoji, text));
    }

    return text;
  });
};

const replaceNative = (str: string, { characters, charPattern }: (typeof metaCache)) => {
  return str.replace(charPattern, (char: string) => `:${characters[char]}:`);
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

    const parsed = content.replace(outsideCode, (str: string) => {
      let output = str;

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

      return output;
    });

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
