/// <amd-module name="emoji"/>

const base = `${window.config.relative_path}/plugins/nodebb-plugin-emoji`;
const buster = window.config['cache-buster'];

export { base, buster };
export function buildEmoji(emoji: StoredEmoji, defer?: boolean) {
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

export let table: MetaData.table;
export let search: (term: string) => StoredEmoji[];

export const strategy = {
  match: /\B:([^\s\n:]+)$/,
  search: (term: string, callback: Callback<StoredEmoji[]>) => {
    callback(search(term));
  },
  index: 1,
  replace: (emoji: StoredEmoji) => {
    return ':' + emoji.name + ': ';
  },
  template: (emoji: StoredEmoji) => {
    return buildEmoji(emoji) + ' ' + emoji.name;
  },
  cache: true,
};

let initialized = false;

export function init(callback?: Callback) {
  if (initialized) {
    return;
  }
  initialized = true;

  Promise.all([
    import('fuzzysearch'),
    import('leven'),
    import('composer/formatting'),
    $.getJSON(`${base}/emoji/table.json?${buster}`) as PromiseLike<MetaData.table>,
  ]).then(([fuzzy, leven, formatting, tableData]) => {
    table = tableData;

    const all: (StoredEmoji & { score?: number })[] = Object.keys(table).map((name) => {
      const { aliases, character, image, keywords, pack } = table[name];
      return { name, aliases, character, image, keywords, pack };
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
      return all.filter((obj) => {
        if (fuzzy(term, obj.name)) {
          obj.score = leven(term, obj.name);
          if (obj.name.startsWith(term)) {
            obj.score -= 1;
          }
    
          return true;
        }
    
        const aliasMatch = fuzzyFind(term, obj.aliases);
        if (aliasMatch) {
          obj.score = 3 * leven(term, aliasMatch);
          if (aliasMatch.startsWith(term)) {
            obj.score -= 1;
          }
    
          return true;
        }
    
        const keywordMatch = fuzzyFind(term, obj.keywords);
        if (keywordMatch) {
          obj.score = 8 * leven(term, keywordMatch);
          if (keywordMatch.startsWith(term)) {
            obj.score -= 1;
          }
    
          return true;
        }
    
        return false;
      }).sort((a, b) => a.score - b.score).slice(0, 10);
    }

    search = fuzzySearch;

    formatting.addButtonDispatch(
      'emoji-add-emoji',
      (textarea: HTMLTextAreaElement) => {
        import('emoji-dialog').then(({ openForInsert }) => {
          openForInsert(textarea);
        });
      },
    );

    if (callback) { setTimeout(callback, 0); }
  }).catch((err) => {
    const e = Error('[[emoji:meta-load-failed]]');
    console.error(e);
    window.app.alertError(e);
    throw err;
  });
}
