import { readFile } from 'fs-extra';

import { tableFile, aliasesFile, asciiFile, charactersFile } from './build';

const buster = require.main.require('./src/meta').config['cache-buster'];
const winston = require.main.require('winston');

let metaCache: {
  table: MetaData.Table;
  aliases: MetaData.Aliases;
  ascii: MetaData.Ascii;
  asciiPattern: RegExp;
  characters: MetaData.Characters;
  charPattern: RegExp;
} = null;
export function clearCache(): void {
  metaCache = null;
}

const escapeRegExpChars = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getTable = async (): Promise<typeof metaCache> => {
  if (metaCache) {
    return metaCache;
  }

  const [
    tableText,
    aliasesText,
    asciiText,
    charactersText,
  ]: [string, string, string, string] = await Promise.all([
    readFile(tableFile, 'utf8'),
    readFile(aliasesFile, 'utf8'),
    readFile(asciiFile, 'utf8'),
    readFile(charactersFile, 'utf8'),
  ]);

  const table = JSON.parse(tableText);
  const aliases = JSON.parse(aliasesText);
  const ascii = JSON.parse(asciiText);
  const characters = JSON.parse(charactersText);

  const asciiPattern = Object.keys(ascii)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExpChars)
    .join('|');
  const charPattern = Object.keys(characters)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExpChars)
    .join('|');

  metaCache = {
    table,
    aliases,
    ascii,
    characters,
    asciiPattern: asciiPattern ?
      new RegExp(`(^|\\s|\\n)(${asciiPattern})(?=\\n|\\s|$)`, 'g') :
      /(?!)/,
    charPattern: charPattern ?
      new RegExp(charPattern, 'g') :
      /(?!)/,
  };

  return metaCache;
};

const outsideCode = /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g;
const outsideElements = /(<[^>]*>)?([^<>]*)/g;
const emojiPattern = /:([a-z\-.+0-9_]+):/g;

interface ParseOptions {
  /** whether to parse ascii emoji representations into emoji */
  ascii?: boolean;
  native?: boolean;
  baseUrl: string;
}

const options: ParseOptions = {
  ascii: false,
  native: false,
  baseUrl: '',
};

export function setOptions(newOptions: ParseOptions): void {
  Object.assign(options, newOptions);
}

export const buildEmoji = (emoji: StoredEmoji, whole: string): string => {
  if (emoji.image) {
    const route = `${options.baseUrl}/plugins/nodebb-plugin-emoji/emoji/${emoji.pack}`;
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

const replaceAscii = (
  str: string,
  { ascii, asciiPattern, table }: (typeof metaCache)
) => str.replace(asciiPattern, (full: string, before: string, text: string) => {
  const emoji = ascii[text] && table[ascii[text]];
  if (emoji) {
    return `${before}${buildEmoji(emoji, text)}`;
  }

  return full;
});

const replaceNative = (
  str: string,
  { characters, charPattern, table }: (typeof metaCache)
) => str.replace(charPattern, (char: string) => {
  const name = characters[char];
  if (table[name]) {
    return `:${name}:`;
  }

  return char;
});

const parse = async (content: string): Promise<string> => {
  if (!content) {
    return content;
  }
  let store: typeof metaCache;
  try {
    store = await getTable();
  } catch (err) {
    winston.error('[emoji] Failed to retrieve data for parse', err);
    return content;
  }
  const { table, aliases } = store;

  const parsed = content.replace(
    outsideCode,
    outsideCodeStr => outsideCodeStr.replace(outsideElements, (_, inside, outside) => {
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
          }
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
          }
        );
      }

      return (inside || '') + (output || '');
    })
  );

  return parsed;
};

export function raw(content: string): Promise<string> {
  return parse(content);
}

export async function post(data: { postData: { content: string } }): Promise<any> {
  // eslint-disable-next-line no-param-reassign
  data.postData.content = await parse(data.postData.content);
  return data;
}
