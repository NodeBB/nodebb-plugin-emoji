/// <amd-module name="emoji"/>

const base = `${window.config.relative_path}/plugins/nodebb-plugin-emoji`;
const buster = window.config['cache-buster'];

export { base, buster };
export function buildEmoji(emoji: StoredEmoji, defer?: boolean) {
  const whole = `:${emoji.name}:`;
  const deferClass = defer ? ' defer' : '';

  if (emoji.image) {
    return `<img
      ${defer ? 'data-' : ''}src="${base}/emoji/${emoji.pack}/${emoji.image}"
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
export let fuse: Fuse<StoredEmoji>;

export const strategy = {
  match: /\B:([^\s\n:]+)$/,
  search: (term: string, callback: Callback<StoredEmoji[]>) => {
    if (!term) {
      callback(Object.keys(table).map(key => table[key]));

      return;
    }

    callback(fuse.search(term));
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
    import('Fuse'),
    import('composer/formatting'),
    Promise.resolve($.getJSON(`${base}/emoji/table.json?${buster}`)) as Promise<MetaData.table>,
  ]).then(([Fuse, formatting, tableData]) => { // tslint:disable-line variable-name
    table = tableData;
    const all = Object.keys(table).map(name => table[name]);

    fuse = new Fuse(all, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      keys: [
        {
          name: 'name',
          weight: 0.6,
        },
        {
          name: 'aliases',
          weight: 0.3,
        },
        {
          name: 'keywords',
          weight: 0.3,
        },
      ],
    });

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
