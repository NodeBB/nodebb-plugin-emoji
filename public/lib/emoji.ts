declare type Callback<T> = (result: T) => void;
declare type EmojiX = {
  meta?: MetaStore,
  all?: StoredEmoji[],
  fuse?: Fuse<StoredEmoji>,
  init?(): void,
  buildEmoji?(emoji: StoredEmoji): string,
  strategy?: any,
};

define('emoji', ['Fuse'], (Fuse: any) => { // tslint:disable-line variable-name
  const emojix: EmojiX = {};

  const base = `${window.config.relative_path}/plugins/nodebb-plugin-emoji`;

  emojix.buildEmoji = (emoji: StoredEmoji) => {
    const whole = `:${emoji.name}:`;

    if (emoji.image) {
      return `<img
        src="${base}/emoji/${emoji.pack}/${emoji.image}"
        class="not-responsive emoji-${emoji.pack} ${emoji.name}"
        title="${whole}"
        alt="${emoji.character}"
      />`;
    }

    return `<span
      class="emoji-${emoji.pack} ${emoji.name}"
      title="${whole}"
    ><span>${emoji.character}</span></span>`;
  };

  emojix.strategy = {
    match: /\B:([^\s\n:]*)?$/,
    search: (term: string, callback: Callback<any[]>) => {
      if (!term) {
        callback(Object.keys(emojix.meta.table).map(key => emojix.meta.table[key]));

        return;
      }

      callback(emojix.fuse.search(term));
    },
    index: 1,
    replace: (emoji: StoredEmoji) => {
      return ':' + emoji.name + ': ';
    },
    template: (emoji: StoredEmoji) => {
      return emojix.buildEmoji(emoji) + ' ' + emoji.name;
    },
    cache: true,
  };

  function init() {
    // load the meta info
    $.getJSON(`${base}/emoji/meta.json`).then((data: MetaStore) => {
      emojix.meta = data;

      const table = emojix.meta.table;
      const aliases = emojix.meta.aliases;

      emojix.all = Object.keys(table)
        .map(name => table[name])
        .concat(Object.keys(aliases)
        .map((alias) => {
          const emoji = table[aliases[alias]];

          return {
            name: alias,
            image: emoji.image,
            character: emoji.character,
            pack: emoji.pack,
          };
        }));

      emojix.fuse = new Fuse(emojix.all, {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        keys: ['name'],
      });
    }).fail((err) => {
      const e = Error('[[emoji:meta-load-failed]]');
      console.error(e);
      window.app.alertError(e);
      throw err;
    });

    require(['composer/formatting'], (composer: any) => {
      composer.addButtonDispatch(
        'emoji-add-emoji',
        (textarea: HTMLTextAreaElement) => {
          require(['emoji-dialog'], (dialog: EmojiDialog) => {
            dialog.openForInsert(textarea);
          });
        },
      );
    });
  }
  emojix.init = init;

  return emojix;
});

require(['emoji'], (emoji: EmojiX) => {
  $(window).on('composer:autocomplete:init chat:autocomplete:init', (e, data) => {
    emoji.init();
    data.strategies.push(emoji.strategy);
  });
});
