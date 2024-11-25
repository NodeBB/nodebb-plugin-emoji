import { readFile } from 'fs-extra';

import { tableFile, aliasesFile, asciiFile, charactersFile } from './build';

const mimeImport = import('mime');

const buster = require.main?.require('./src/meta').config['cache-buster'];
const winston = require.main?.require('winston');

interface MetaCache {
  table: MetaData.Table;
  aliases: MetaData.Aliases;
  ascii: MetaData.Ascii;
  asciiPattern: RegExp;
  characters: MetaData.Characters;
  charPattern: RegExp;
}

let metaCache: MetaCache | null = null;
export function clearCache(): void {
  metaCache = null;
}

const escapeRegExpChars = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

async function getTable(): Promise<MetaCache> {
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
}

const outsideCode = /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g;
const outsideElements = /(<[^>]*>)?([^<>]*)/g;
const emojiPattern = /:([a-z\-.+0-9_]+):/g;

interface ParseOptions {
  /** whether to parse ascii emoji representations into emoji */
  ascii: boolean;
  /** whether to parse native emoji */
  native: boolean;
  /** whether to parse topic titles */
  titles: boolean;
  baseUrl: string;
}

const options: ParseOptions = {
  ascii: false,
  native: false,
  titles: false,
  baseUrl: '',
};

export function setOptions(newOptions: ParseOptions): void {
  Object.assign(options, newOptions);
}

export const buildEmoji = (
  emoji: StoredEmoji,
  whole: string,
  mode: 'returnChar' | 'returnWhole' | null = null,
  onReplace: (e: StoredEmoji, w: string) => void = () => {}
): string => {
  onReplace(emoji, whole);

  if (mode === 'returnChar') {
    return emoji.character || whole;
  }
  if (mode === 'returnWhole') {
    return whole;
  }

  if (emoji.image) {
    const route = `${options.baseUrl}/plugins/nodebb-plugin-emoji/emoji/${emoji.pack}`;
    return `<img
      src="${route}/${emoji.image}?${buster}"
      class="not-responsive emoji emoji-${emoji.pack} emoji--${emoji.name}"
      style="height: 23px; width: auto; vertical-align: middle;"
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
  { ascii, asciiPattern, table }: MetaCache,
  mode: 'returnChar' | 'returnWhole' | null,
  onReplace: (e: StoredEmoji, w: string) => void
) => str.replace(asciiPattern, (full: string, before: string, text: string) => {
  const emoji = ascii[text] && table[ascii[text]];
  if (emoji) {
    const whole = (mode === 'returnWhole') ? `:${emoji.name}:` : text;
    return `${before}${buildEmoji(emoji, whole, mode, onReplace)}`;
  }

  return full;
});

const replaceNative = (
  str: string,
  { characters, charPattern, table }: MetaCache,
  onReplace: (e: StoredEmoji, w: string) => void
) => str.replace(charPattern, (char: string) => {
  const name = characters[char];
  const emoji = table[name];
  if (emoji) {
    return buildEmoji(emoji, char, null, onReplace);
  }

  return char;
});

async function parse(
  content: string,
  mode: 'returnChar' | 'returnWhole' | null = null,
  onReplace: (e: StoredEmoji, w: string) => void = () => {}
): Promise<string> {
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

      if (options.native && mode === null) {
        // avoid parsing native inside HTML tags
        // also avoid converting ascii characters
        output = output.replace(
          /(<[^>]+>)|([^0-9a-zA-Z`~!@#$%^&*()\-=_+{}|[\]\\:";'<>?,./\s\n]+)/g,
          (full: string, tag: string, text: string) => {
            if (text) {
              return replaceNative(text, store, onReplace);
            }

            return full;
          }
        );
      }

      output = output.replace(emojiPattern, (whole: string, text: string) => {
        const name = text.toLowerCase();
        const emoji = table[name] || table[aliases[name]];

        if (emoji) {
          return buildEmoji(emoji, whole, mode, onReplace);
        }

        return whole;
      });

      if (options.ascii) {
        // avoid parsing ascii inside HTML tags
        output = output.replace(
          /(<[^>]+>)|([^<]+)/g,
          (full: string, tag: string, text: string) => {
            if (text) {
              return replaceAscii(text, store, mode, onReplace);
            }

            return full;
          }
        );
      }

      return (inside || '') + (output || '');
    })
  );

  return parsed;
}

export function raw(content: string): Promise<string> {
  return parse(content);
}

export async function post(data: { postData: { content: string }, type: string }): Promise<any> {
  if (data.type === 'activitypub.note') {
    return data;
  }

  // eslint-disable-next-line no-param-reassign
  data.postData.content = await parse(data.postData.content);
  return data;
}

export async function topic(data: { topic: { title: string } }): Promise<any> {
  if (options.titles) {
    // eslint-disable-next-line no-param-reassign
    data.topic.title = await parse(data.topic.title);
  }
  return data;
}

export async function topics(data: { topics: [{ title: string }] }): Promise<any> {
  if (options.titles) {
    await Promise.all(data.topics.map(async (t) => {
      // eslint-disable-next-line no-param-reassign
      t.title = await parse(t.title);
    }));
  }
  return data;
}

export async function postSummaries(data: { posts: [{ topic: { title: string } }]}) : Promise<any> {
  if (options.titles) {
    await Promise.all(data.posts.map(async (p) => {
      if (p && p.topic && p.topic.title) {
        // eslint-disable-next-line no-param-reassign
        p.topic.title = await parse(p.topic.title);
      }
    }));
  }
  return data;
}

export async function notifications(
  data: { notifications: [{ bodyShort: string } ] }
) : Promise<any> {
  if (options.titles) {
    await Promise.all(data.notifications.map(async (n) => {
      if (n && n.bodyShort) {
        // eslint-disable-next-line no-param-reassign
        n.bodyShort = await parse(n.bodyShort);
      }
    }));
  }
  return data;
}

export async function header(
  data: { templateData: { metaTags: [{ name: string, property: string, content: string }]}}
) : Promise<any> {
  if (!data || !data.templateData || !Array.isArray(data.templateData.metaTags)) {
    return data;
  }
  data.templateData.metaTags.forEach(async (t) => {
    if (t && (t.property === 'og:title' || t.name === 'title')) {
      // eslint-disable-next-line no-param-reassign
      t.content = await parse(t.content, 'returnChar');
    }
  });
  return data;
}

export async function email(
  data: { template: string, params: any}
) : Promise<any> {
  if (data.template === 'notification' && data.params.intro) {
    // eslint-disable-next-line no-param-reassign
    data.params.intro = await parse(data.params.intro, 'returnChar');
  }
  return data;
}

export async function activitypubNote(data: {
  object: {
    source: { content: string },
    '@context'?: unknown,
    tag: {
      id: string;
      type: 'Emoji';
      name: string;
      icon: {
        type: 'Image';
        mediaType: string;
        url: string;
      }
    }[],
    content: string,
  },
  post: unknown
}): Promise<any> {
  const mime = (await mimeImport).default;

  const emojiContext = {
    toot: 'http://joinmastodon.org/ns#',
    Emoji: 'toot:Emoji',
  };

  /* eslint-disable no-param-reassign */
  data.object['@context'] = data.object['@context'] || [];
  if (Array.isArray(data.object['@context'])) {
    data.object['@context'].push(emojiContext);
  } else {
    data.object['@context'] = [data.object['@context'], emojiContext];
  }

  data.object.tag = data.object.tag || [];

  data.object.content = await parse(data.object.content, 'returnWhole', (emoji, whole) => {
    if (!emoji.image) {
      return;
    }

    const url = `${options.baseUrl}/plugins/nodebb-plugin-emoji/emoji/${emoji.pack}/${emoji.image}?${buster}`;
    data.object.tag.push({
      id: url,
      type: 'Emoji',
      name: whole,
      icon: {
        type: 'Image',
        mediaType: mime.getType(emoji.image) || '',
        url,
      },
    });
  });

  return data;
}
