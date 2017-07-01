define('emoji', [], () => {
  const base = `${window.config.relative_path}/plugins/nodebb-plugin-emoji`;
  const buster = window.config['cache-buster'];

  const emojix: EmojiX = {
    base,
    buster,
    buildEmoji(emoji: StoredEmoji, defer?: boolean) {
      const whole = `:${emoji.name}:`;
      const deferClass = defer ? ' defer' : '';

      if (emoji.image) {
        return `<img
          ${defer ? 'data-' : ''}src="${base}/emoji/${emoji.pack}/${emoji.image}"
          class="not-responsive emoji-${emoji.pack} emoji--${emoji.name} ${deferClass}"
          title="${whole}"
          alt="${emoji.character}"
        />`;
      }

      return `<span
        class="emoji-${emoji.pack} emoji--${emoji.name}"
        title="${whole}"
      ><span>${emoji.character}</span></span>`;
    },
    strategy: {
      match: /\B:([^\s\n:]*)?$/,
      search: (term: string, callback: Callback<any[]>) => {
        if (!term) {
          callback(Object.keys(emojix.table).map(key => emojix.table[key]));

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
    },
    table: null,
    fuse: null,
    init() {
      // tslint:disable-next-line variable-name
      require(['Fuse', 'composer/formatting'], (Fuse: any, composer: any) => {
        // load the meta info
        $.getJSON(`${base}/emoji/table.json?${buster}`).then((table: MetaData.table) => {
          emojix.table = table;

          const all = Object.keys(table).map(name => table[name]);

          emojix.fuse = new Fuse(all, {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            keys: ['name', 'aliases', 'keywords'],
          });
        }).fail((err) => {
          const e = Error('[[emoji:meta-load-failed]]');
          console.error(e);
          window.app.alertError(e);
          throw err;
        });

        composer.addButtonDispatch(
          'emoji-add-emoji',
          (textarea: HTMLTextAreaElement) => {
            require(['emoji-dialog'], (dialog: EmojiDialog) => {
              dialog.openForInsert(textarea);
            });
          },
        );
      });
    },
  };

  return emojix;
});

require(['emoji'], (emoji: EmojiX) => {
  $(window).on('composer:autocomplete:init chat:autocomplete:init', (e, data) => {
    emoji.init();
    data.strategies.push(emoji.strategy);
  });
});
