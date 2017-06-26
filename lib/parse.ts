import { readFile } from 'fs';
import { join } from 'path';
import { parallel } from 'async';

import { tableFile, aliasesFile, asciiFile } from './build';

const nconf = require.main.require('nconf');
const url = nconf.get('url');

let metaCache: {
  table: MetaData.table,
  aliases: MetaData.aliases,
  ascii: MetaData.ascii,
} = null;
export function clearCache() {
  metaCache = null;
}

const getTable = (callback: NodeBack<typeof metaCache>) => {
  if (metaCache) {
    callback(null, metaCache);
    return;
  }

  parallel({
    table: next => readFile(tableFile, next),
    aliases: next => readFile(aliasesFile, next),
    ascii: next => readFile(asciiFile, next),
  }, (err: Error, results) => {
    if (err) {
      callback(err);
      return;
    }

    try {
      metaCache = {
        table: JSON.parse(results.table.toString()),
        aliases: JSON.parse(results.aliases.toString()),
        ascii: JSON.parse(results.ascii.toString()),
      };
      callback(null, metaCache);
    } catch (e) {
      callback(e);
    }
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

interface ParseOptions {
  /** whether to parse ascii emoji representations into emoji */
  shouldParseAscii?: boolean;
}

const options = {
  shouldParseAscii: false,
};

const replaceAscii = (str: string, { table, ascii, aliases }: (typeof metaCache)) => {
  let out = '';

  const keys = Object.keys(ascii);
  const keysLen = keys.length;

  const strLen = str.length;
  let cursor = 0;
  let lastBreak = 0;

  while (cursor < strLen) {
    let found = false;

    for (let j = 0; j < keysLen; j += 1) {
      const key = keys[j];
      const len = key.length;
      const slice = str.slice(cursor, cursor + len);

      if (key === slice) {
        const name = ascii[key];
        const emoji = table[name] || table[aliases[name]];

        if (emoji) {
          out += str.slice(lastBreak, cursor);
          out += buildEmoji(emoji, slice);
          cursor += len;
          lastBreak = cursor;

          found = true;
          break;
        }
      }
    }

    if (!found) {
      cursor += 1;
    }
  }

  out += str.slice(lastBreak);

  return out;
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
      const replaced = str
        .replace(emojiPattern, (whole: string, text: string) => {
          const name = text.toLowerCase();
          const emoji = table[name] || table[aliases[name]];

          if (emoji) {
            return buildEmoji(emoji, whole);
          }

          return whole;
        });

      if (options.shouldParseAscii) {
        // avoid parsing text inside HTML tags
        return replaced.replace(/(<[^>]+>)|([^<]+)/g, (x: string, tag: string, text: string) => {
          if (tag) {
            return tag;
          }
          if (text) {
            return replaceAscii(text, store);
          }
          return x;
        });
      }

      return replaced;
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
