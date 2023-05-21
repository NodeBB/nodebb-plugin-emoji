/// <amd-module name="emoji"/>

const base = `${config.assetBaseUrl}/plugins/nodebb-plugin-emoji`;
const buster = config['cache-buster'];

export { base, buster };
export function buildEmoji(emoji: StoredEmoji, defer?: boolean): string {
  const whole = `:${emoji.name}:`;
  const deferClass = defer ? ' defer' : '';

  if (emoji.image) {
    return `<img
      ${defer ? 'data-' : ''}src="${base}/emoji/${emoji.pack}/${emoji.image}?${buster}"
      class="not-responsive emoji emoji-${emoji.pack} emoji--${emoji.name} ${deferClass}"
      title="${whole}"
      alt="${emoji.character}"
    />`;
  }

  return `<span
    class="emoji-${emoji.pack} emoji--${emoji.name}"
    title="${whole}"
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
  template: (emoji: StoredEmoji): string => `${buildEmoji(emoji)} ${emoji.name}`,
  cache: true,
};

let initialized: Promise<void>;

export function init(callback?: Callback<void>): Promise<void> {
  initialized = initialized || Promise.all([
    import('fuzzysearch'),
    import('leven'),
    import('composer/formatting'),
    $.getJSON(`${base}/emoji/table.json?${buster}`) as PromiseLike<MetaData.Table>,
  ]).then(([fuzzy, leven, formatting, tableData]) => {
    table = tableData;

    const all: (StoredEmoji & { score?: number })[] = Object.keys(table).map((name) => {
      const emoji = table[name];

      return {
        name,
        aliases: emoji.aliases,
        keywords: emoji.keywords,
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

    function fuzzySearch(term: string) {
      function score(match: string, weight: number) {
        const weighted = weight * (1 + leven(term, match));
        return match.startsWith(term) ? weighted - 2 : weighted;
      }

      return all.filter((obj) => {
        if (fuzzy(term, obj.name)) {
          obj.score = score(obj.name, 1);

          return true;
        }

        const aliasMatch = fuzzyFind(term, obj.aliases);
        if (aliasMatch) {
          obj.score = score(aliasMatch, 3);

          return true;
        }

        const keywordMatch = fuzzyFind(term, obj.keywords);
        if (keywordMatch) {
          obj.score = score(keywordMatch, 7);

          return true;
        }

        return false;
      }).sort((a, b) => a.score - b.score).sort((a, b) => {
        const aPrefixed = +a.name.startsWith(term);
        const bPrefixed = +b.name.startsWith(term);

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
