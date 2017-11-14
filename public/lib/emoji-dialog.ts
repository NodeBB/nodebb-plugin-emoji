/// <amd-module name="emoji-dialog"/>

import { translate } from 'translator';
import { insertIntoTextarea, updateTextareaSelection } from 'composer/controls';
import { apply as applyScrollStop } from 'scrollStop';
import { buster, base, table, buildEmoji } from 'emoji';

const $html = $('html');

const dialogActions = {
  open(dialog: JQuery) {
    $html.addClass('emoji-insert');
    return dialog.addClass('open');
  },
  close(dialog: JQuery) {
    $html.removeClass('emoji-insert');
    return dialog.removeClass('open');
  },
};

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
export function init(callback: Callback<JQuery>) {
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
          html: buildEmoji(emoji, true),
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
      translate(result, (html: string) => {
        const dialog = $(html).appendTo('body');

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

        applyScrollStop(dialog.find('.tab-content')[0]);

        const close = () => dialogActions.close(dialog);

        $(window).on('action:composer.discard action:composer.submit', close);
        dialog.find('.close').click(close);

        callback(dialog);
      });
    });
  });
}

export function openForInsert(textarea: HTMLTextAreaElement) {
  function after(dialog: JQuery) {
    if (dialog.hasClass('open')) {
      dialogActions.close(dialog);
      return;
    }

    dialog.off('click').on('click', '.emoji-link', (e) => {
      e.preventDefault();
      const name = (e.currentTarget as HTMLAnchorElement).name;
      const text = `:${name}: `;
      const { selectionStart, selectionEnd } = textarea;
      const end = selectionEnd + text.length;
      const start = selectionStart === selectionEnd ? end : selectionStart;

      insertIntoTextarea(textarea, text);
      updateTextareaSelection(textarea, start, end);
      $(textarea).trigger('input');
    });

    const buttonRect = $('[data-format="emoji-add-emoji"]')[0].getBoundingClientRect();
    const position = {
      bottom: 'auto',
      top: 'auto',
      right: 'auto',
      left: 'auto',
    };
    if (buttonRect.top > 500) {
      position.top = `${buttonRect.top - 400}px`;
    } else {
      position.top = `${buttonRect.top + 40}px`;
    }
    if (buttonRect.left > buttonRect.right) {
      position.left = `${buttonRect.left - 400}px`;
    } else {
      position.left = `${buttonRect.left + 40}px`;
    }

    // @ts-ignore
    dialog.css(position).draggable();

    dialogActions.open(dialog);
  }

  const dialog = $('#emoji-dialog');
  if (dialog.length) {
    after(dialog);
  } else {
    init(after);
  }
}
