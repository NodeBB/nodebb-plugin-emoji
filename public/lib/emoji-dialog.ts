declare interface EmojiDialog {
  openForInsert(
    textarea: HTMLTextAreaElement,
  ): void;
}

define(['translator', 'composer/controls', 'scrollStop', 'emoji'], (
  translator: any,
  controls: any,
  scrollStop: {
    apply(element: Element): void,
  },
  emojix: EmojiX,
) => {
  const meta = emojix.meta;

  const $html = $('html');

  // create modal
  function init(callback: Callback<JQuery>) {
    const categories = Object.keys(meta.categories).map((category) => {
      const emojis = meta.categories[category].map(name => meta.table[name]);
      return {
        name: category,
        emojis: emojis.map(emoji => ({
          name: emoji.name,
          html: emojix.buildEmoji(emoji),
        })),
      };
    });

    window.templates.parse('partials/emoji-dialog', {
      categories,
      packs: meta.packs,
    }, (result) => {
      translator.translate(result, (html: string) => {
        const dialog = $(html).appendTo('body');

        dialog.find('.emoji-tabs .nav-tabs a').click((e) => {
          e.preventDefault();
          $(e.target).tab('show');
        });

        dialog.modal({
          backdrop: false,
          show: false,
        });

        dialog.open = function () {
          $html.addClass('emoji-insert');
          return this.addClass('open');
        };
        dialog.close = function () {
          $html.removeClass('emoji-insert');
          return this.removeClass('open');
        };

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
  }

  const emojiDialog: EmojiDialog = {
    openForInsert(textarea: HTMLTextAreaElement) {
      function after(dialog: JQuery) {
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

      if ($('#emoji-dialog').length) {
        after($('#emoji-dialog'));
      } else {
        init(after);
      }
    },
  };

  return emojiDialog;
});
