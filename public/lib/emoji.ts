/// <amd-module name="emoji"/>

const base = `${config.asset_base_url}/plugins/nodebb-plugin-emoji`;
const buster = config['cache-buster'];

export { base, buster };

/*
 * Localized names: build/emoji/names/<language>.json maps an emoji character (without U+FE0F) to
 * "<name>|<keyword>|<keyword>..." in that language (generated from Unicode CLDR, see
 * scripts/generate-names.js). The names are shown next to the English ones and are searchable.
 */
let localNames: { [character: string]: string } = {};
const withoutVariation = (character: string) => character.replace(/\uFE0F/g, '');

export function localizedName(emoji: { character?: string }): string {
  const entry = emoji.character ? localNames[withoutVariation(emoji.character)] : '';
  return entry ? entry.split('|')[0] : '';
}

function namesLanguage(available: string[]): string | null {
  const language = (config.userLang || config.defaultLang || 'en-GB').replace('_', '-');
  if (available.indexOf(language) !== -1) {
    return language;
  }
  const short = language.split('-')[0];
  if (short === 'en') {
    return null; // the English names are the ones of the emoji itself
  }
  for (let i = 0; i < available.length; i += 1) {
    if (available[i] === short || available[i].split('-')[0] === short) {
      return available[i];
    }
  }
  return null;
}

// Names are optional: an older build has no names.json, and a missing file must not break the emoji
function loadNames(): Promise<void> {
  return new Promise((resolve) => {
    $.getJSON(`${base}/emoji/names.json?${buster}`).then((available: string[]) => {
      const language = namesLanguage(available);
      if (!language) {
        resolve();
        return;
      }
      $.getJSON(`${base}/emoji/names/${language}.json?${buster}`).then((names: typeof localNames) => {
        localNames = names;
        resolve();
      }, () => resolve());
    }, () => resolve());
  });
}

export function buildEmoji(emoji: StoredEmoji, defer?: boolean): string {
  const whole = `:${emoji.name}:`;
  const local = localizedName(emoji);
  const title = (local ? `${local} · ${whole}` : whole).replace(/"/g, '&quot;');
  const deferClass = defer ? ' defer' : '';

  if (emoji.image) {
    return `<img
      ${defer ? 'data-' : ''}src="${base}/emoji/${emoji.pack}/${emoji.image}?${buster}"
      class="not-responsive emoji emoji-${emoji.pack} emoji--${emoji.name} ${deferClass}"
      title="${title}"
      alt="${emoji.character}"
    />`;
  }

  return `<span
    class="emoji-${emoji.pack} emoji--${emoji.name}"
    title="${title}"
  ><span>${emoji.character}</span></span>`;
}

/* eslint-disable import/no-mutable-exports */
export let table: MetaData.Table;
export let search: (term: string) => StoredEmoji[];

export const strategy = {
  match: /\B:([^\s\n:]+)$/,
  search: (term: string, callback: Callback<StoredEmoji[]>): void => {
    callback(search(term.toLowerCase().replace(/[_-]/g, '')).slice(0, 10));
  },
  index: 1,
  replace: (emoji: StoredEmoji): string => `:${emoji.name}: `,
  template: (emoji: StoredEmoji): string => {
    const local = localizedName(emoji);
    return `${buildEmoji(emoji)} ${emoji.name}${local ? ` · ${local}` : ''}`;
  },
  cache: true,
};

let initialized: Promise<void>;

export function init(callback?: Callback<void>): Promise<void> {
  initialized = initialized || Promise.all([
    import('fuzzysearch'),
    import('leven'),
    import('composer/formatting'),
    $.getJSON(`${base}/emoji/table.json?${buster}`) as PromiseLike<MetaData.Table>,
    loadNames(),
  ]).then(([fuzzy, leven, formatting, tableData]) => {
    table = tableData;

    type Searchable = StoredEmoji & { score?: number; localName: string; localKeywords: string[] };

    const all: Searchable[] = Object.keys(table).map((name) => {
      const emoji = table[name];
      const entry = emoji.character ? localNames[withoutVariation(emoji.character)] : '';
      const localized = (entry || '').toLowerCase().split('|');

      return {
        localName: localized[0] || '',
        localKeywords: localized.slice(1),
        name: name.toLowerCase(),
        aliases: emoji.aliases.map(alias => alias.toLowerCase()),
        keywords: emoji.keywords.map(keyword => keyword.toLowerCase()),
        character: emoji.character,
        image: emoji.image,
        pack: emoji.pack,
      };
    });

    function fuzzyFind(term: string, arr: string[]) {
      const l = arr.length;

      for (let i = 0; i < l; i += 1) {
        if (fuzzy(term, arr[i])) {
          return arr[i];
        }
      }

      return null;
    }

    function includesFind(term: string, arr: string[]) {
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].indexOf(term) !== -1) {
          return arr[i];
        }
      }

      return null;
    }

    function fuzzySearch(term: string) {
      const q = term.toLowerCase();

      function score(match: string, weight: number) {
        const weighted = weight * (1 + leven(q, match));
        return match.startsWith(q) ? weighted - 2 : weighted;
      }

      return all.filter((obj) => {
        if (fuzzy(q, obj.name)) {
          obj.score = score(obj.name, 1);

          return true;
        }

        // localized text is matched as a substring: a short word's letters are found, in order,
        // in almost any long name, and the subsequence match of `fuzzy` would accept all of them
        if (obj.localName && obj.localName.indexOf(q) !== -1) {
          obj.score = score(obj.localName, 1);

          return true;
        }

        const aliasMatch = fuzzyFind(q, obj.aliases);
        if (aliasMatch) {
          obj.score = score(aliasMatch, 3);

          return true;
        }

        const keywordMatch = fuzzyFind(q, obj.keywords);
        if (keywordMatch) {
          obj.score = score(keywordMatch, 7);

          return true;
        }

        const localKeywordMatch = includesFind(q, obj.localKeywords);
        if (localKeywordMatch) {
          obj.score = score(localKeywordMatch, 7);

          return true;
        }

        return false;
      }).sort((a, b) => a.score - b.score).sort((a, b) => {
        const aPrefixed = +(a.name.startsWith(q) || a.localName.startsWith(q));
        const bPrefixed = +(b.name.startsWith(q) || b.localName.startsWith(q));

        return bPrefixed - aPrefixed;
      });
    }

    search = fuzzySearch;

    formatting.addButtonDispatch(
      'emoji-add-emoji',
      (textarea: HTMLTextAreaElement, start: number, end: number, event: JQuery.ClickEvent) => {
        import('emoji-dialog')
          .then(({ toggleForInsert }) => toggleForInsert(textarea, start, end, event));
      }
    );
  }).catch(async (err) => {
    const e = Error('[[emoji:meta-load-failed]]');
    console.error(e);
    const alerts = await app.require('alerts');
    alerts.error(e);
    throw err;
  });

  if (callback) {
    initialized.then(() => setTimeout(callback, 0));
  }

  return initialized;
}
