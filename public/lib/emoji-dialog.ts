declare interface EmojiDialog {
  openForInsert(
    textarea: HTMLTextAreaElement,
  ): void;
  init(callback: Callback<JQuery>): void;
}

interface JQuery {
  open(): JQuery;
  close(): JQuery;
}

define(['translator', 'composer/controls', 'scrollStop', 'emoji'], (
  translator: any,
  controls: any,
  scrollStop: {
    apply(element: Element): void,
  },
  emojix: EmojiX,
) => {
  const $html = $('html');

  function dialogify(dialog: JQuery) {
    dialog.open = function () {
      $html.addClass('emoji-insert');
      return this.addClass('open');
    };
    dialog.close = function () {
      $html.removeClass('emoji-insert');
      return this.removeClass('open');
    };

    return dialog;
  }

  const { buster, base, table } = emojix;

  const priorities: {
    [name: string]: number,
  } = {
    people: 10,
    nature: 9,
    food: 8,
    activity: 7,
    travel: 6,
    objects: 5,
    symbols: 4,
    flags: 3,
    regional: 2,
    modifier: 1,
    other: 0,
  };

  // create modal
  function init(callback: Callback<JQuery>) {
    Promise.all([
      $.getJSON(`${base}/emoji/categories.json?${buster}`),
      $.getJSON(`${base}/emoji/packs.json?${buster}`),
    ]).then(([categoriesInfo, packs]: [MetaData.categories, MetaData.packs]) => {
      const categories = Object.keys(categoriesInfo).map((category) => {
        const emojis = categoriesInfo[category].map(name => table[name]);
        return {
          name: category,
          emojis: emojis.map(emoji => ({
            name: emoji.name,
            html: emojix.buildEmoji(emoji, true),
          })),
        };
      }).sort((a, b) => {
        const aPriority = priorities[a.name] || 0;
        const bPriority = priorities[b.name] || 0;

        return bPriority - aPriority;
      });

      window.templates.parse('partials/emoji-dialog', {
        categories,
        packs,
      }, (result) => {
        translator.translate(result, (html: string) => {
          const dialog = dialogify($(html).appendTo('body'));

          dialog.find('.emoji-tabs .nav-tabs a').click((e) => {
            e.preventDefault();
            $(e.target).tab('show');
          }).on('show.bs.tab', (e) => {
            $(e.target.getAttribute('href'))
              .find('.emoji-link img.defer')
              .removeClass('defer')
              .each((i, elem) => {
                const $elem = $(elem);
                const src = $elem.attr('data-src');
                $elem.attr('src', src);
              });
          }).first().trigger('show.bs.tab');

          dialog.modal({
            backdrop: false,
            show: false,
          });

          scrollStop.apply(dialog.find('.tab-content')[0]);

          const adjustDialog = () => {
            const composer = $('.composer:visible')[0];
            if (composer) {
              const top = parseInt(composer.style.top, 10);
              dialog.css('bottom', `${100 - top - 5}%`);
            } else {
              dialog.close();
            }
          };

          adjustDialog();
          $(window).on('action:composer.resize', () => requestAnimationFrame(adjustDialog));
          $(window).on('action:composer.discard action:composer.submit', () => dialog.close());
          dialog.find('.close').click(() => dialog.close());

          callback(dialog);
        });
      });
    });
  }

  const emojiDialog: EmojiDialog = {
    openForInsert(textarea: HTMLTextAreaElement) {
      function after(dialog: JQuery) {
        if (dialog.hasClass('open')) {
          dialog.close();
          return;
        }

        dialog.off('click').on('click', '.emoji-link', (e) => {
          e.preventDefault();
          const name = (<HTMLAnchorElement>e.currentTarget).name;
          const text = `:${name}: `;
          const { selectionStart, selectionEnd } = textarea;
          const end = selectionEnd + text.length;
          const start = selectionStart === selectionEnd ? end : selectionStart;

          controls.insertIntoTextarea(textarea, text);
          controls.updateTextareaSelection(textarea, start, end);
          $(textarea).trigger('input');
        });

        dialog.open();
      }

      const dialog = $('#emoji-dialog');
      if (dialog.length) {
        after(dialogify(dialog));
      } else {
        init(after);
      }
    },
    init,
  };

  return emojiDialog;
});
