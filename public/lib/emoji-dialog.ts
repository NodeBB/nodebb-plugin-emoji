// eslint-disable-next-line spaced-comment
/// <amd-module name="emoji-dialog"/>

import { Translator } from 'translator';
import { render } from 'benchpress';
import { insertIntoTextarea, updateTextareaSelection } from 'composer/controls';
import { apply as applyScrollStop } from 'scrollStop';
import {
  buster,
  base,
  table,
  buildEmoji,
  init as initEmoji,
  search,
} from 'emoji';

const $html = $('html');

export const dialogActions = {
  open(dialog: JQuery): JQuery {
    $html.addClass('emoji-insert');
    dialog.addClass('open');
    dialog.appendTo(document.fullscreenElement || 'body');
    if (!utils.isTouchDevice()) {
      dialog.find('.emoji-dialog-search').focus();
    }

    // need this setTimeout or onDocumentClick gets triggered too early
    // and causes https://github.com/NodeBB/NodeBB/issues/10589
    setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      $(document).off('click', onDocumentClick).on('click', onDocumentClick);
    }, 0);
    return dialog;
  },
  close(dialog: JQuery): JQuery {
    // eslint-disable-next-line no-use-before-define
    $(document).off('click', onDocumentClick);
    $html.removeClass('emoji-insert');
    return dialog.removeClass('open');
  },
};

function onDocumentClick(e:JQuery.TriggeredEvent) {
  const dialog = $('#emoji-dialog');
  if (!$(e.target).is('.emoji-dialog *') && dialog.length) {
    dialogActions.close(dialog);
  }
}

const priorities: {
  [name: string]: number;
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

if (config.emojiCustomFirst) {
  priorities.custom = 100;
}

const translator = Translator.create();

function stringCompare(a: string, b: string) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}

// create modal
export function init(callback: Callback<JQuery>): void {
  Promise.all([
    $.getJSON(`${base}/emoji/categories.json?${buster}`),
    $.getJSON(`${base}/emoji/packs.json?${buster}`),
    new Promise((resolve) => { initEmoji(resolve); }),
  ])
    .then(([categoriesInfo, packs]: [MetaData.Categories, MetaData.Packs, undefined]) => {
      const categories = Object.keys(categoriesInfo).map((category) => {
        const emojis = categoriesInfo[category].map(name => table[name]);
        return {
          name: category,
          emojis: emojis.map(emoji => ({
            name: emoji.name,
            html: buildEmoji(emoji, true),
          })).sort((a, b) => stringCompare(a.name, b.name)),
        };
      }).sort((a, b) => {
        const aPriority = priorities[a.name] || 0;
        const bPriority = priorities[b.name] || 0;

        return bPriority - aPriority;
      });

      return render('partials/emoji-dialog', {
        categories,
        packs,
      });
    })
    .then(result => translator.translate(result)).then((html) => {
      const dialog = $(html).appendTo(document.fullscreenElement || 'body');

      dialog.find('.emoji-dialog-search').on('input', (e) => {
        const value = (e.target as HTMLInputElement).value;

        if (!value) {
          dialog.find('.emoji-dialog-search-results').addClass('hidden');
          dialog.find('.nav-tabs .emoji-dialog-search-results').next().find('a').tab('show');
          return;
        }

        const results = search(value)
          .slice(0, 100)
          .map(
            emoji => `<a class="emoji-link" name="${emoji.name}" href="#">${buildEmoji(emoji, false)}</a>`
          )
          .join('\n');

        dialog.find('.tab-pane.emoji-dialog-search-results').html(results);
        dialog.find('.emoji-dialog-search-results').removeClass('hidden');
        dialog.find('.nav-tabs .emoji-dialog-search-results a').tab('show');
        dialog.find('.emoji-dialog-search').focus();
      });

      const tabContent = dialog.find('.emoji-tabs .tab-content');

      function showDeferred(container: JQuery) {
        const rect = tabContent[0].getBoundingClientRect();
        const num = Math.ceil((rect.width * rect.height) / (40 * 40));

        container
          .find('.emoji-link img.defer')
          .filter((i, elem) => {
            if (i <= num) {
              return true;
            }

            const elemRect = elem.getBoundingClientRect();
            return elemRect.right > rect.left &&
              elemRect.left < rect.right &&
              elemRect.bottom > rect.top &&
              elemRect.top < rect.bottom;
          })
          .removeClass('defer')
          .each((i, elem) => {
            const src = elem.getAttribute('data-src');
            elem.setAttribute('src', src);
          });
      }

      const firstTab = dialog.find('.emoji-tabs .nav-tabs a').click((e) => {
        e.preventDefault();
        $(e.target).tab('show');
      }).on('show.bs.tab', (e) => {
        showDeferred($(e.target.getAttribute('href')));
      }).eq(1);

      setTimeout(() => firstTab.trigger('show.bs.tab'), 10);

      tabContent.on('scroll', () => {
        showDeferred(tabContent.find('.tab-pane.active'));
      });

      applyScrollStop(tabContent[0]);

      const close = () => dialogActions.close(dialog);

      $(window).on([
        'action:composer.discard',
        'action:composer.submit',
        'action:composer.minimize',
        'action:chat.minimize',
        'action:chat.closed',
      ].join(' '), close);

      dialog.find('.close').on('click', close);

      callback(dialog);
    })
    .catch((err) => {
      console.error('Failed to initialize emoji dialog', err);
    });
}

export function toggle(
  opener: HTMLElement | null,
  onClick: (e: JQuery.Event, name: string, dialog: JQuery) => void
): void {
  function after(dialog: JQuery) {
    if (dialog.hasClass('open')) {
      dialogActions.close(dialog);
      return;
    }

    dialog.off('click').on('click', '.emoji-link', (e) => {
      e.preventDefault();
      const name = (e.currentTarget as HTMLAnchorElement).name;

      onClick(e, name, dialog);
    });

    // default if there's no button
    const buttonRect = opener ? opener.getBoundingClientRect() : {
      top: window.innerHeight / 3,
      left: window.innerWidth / 3,
    };
    const position = {
      bottom: 'auto',
      top: 'auto',
      right: 'auto',
      left: 'auto',
    };
    if (buttonRect.top > 440) {
      position.top = `${buttonRect.top - 400}px`;
    } else {
      position.top = `${buttonRect.top + 40}px`;
    }
    if (buttonRect.left < window.innerWidth / 2) {
      position.left = `${buttonRect.left + 40}px`;
    } else {
      position.left = `${buttonRect.left - 400}px`;
    }

    dialog.css(position);

    dialogActions.open(dialog);
  }

  const dialog = $('#emoji-dialog');
  if (dialog.length) {
    after(dialog);
  } else {
    init(after);
  }
}

export function toggleForInsert(
  textarea: HTMLTextAreaElement,
  selectStart: number,
  selectEnd: number,
  event: JQuery.ClickEvent
): void {
  // handle new and old API case
  let button;
  if (event && event.target) {
    button = $(event.target);
  } else {
    button = $(textarea).parents('.composer-container').find('[data-format="emoji-add-emoji"]');
  }
  button = button[0];

  toggle(button, (e, name) => {
    const text = `:${name}: `;
    const { selectionStart, selectionEnd } = textarea;
    const end = selectionEnd + text.length;
    const start = selectionStart === selectionEnd ? end : selectionStart;

    insertIntoTextarea(textarea, text);
    updateTextareaSelection(textarea, start, end);
    $(textarea).trigger('input');
  });
}
