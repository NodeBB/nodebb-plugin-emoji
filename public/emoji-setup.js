/* eslint-disable */

require(['emoji'], function (emoji) {
  $(window).on('composer:autocomplete:init chat:autocomplete:init', function (e, data) {
    emoji.init();
    data.strategies.push(emoji.strategy);
  });

  $(window).on('action:chat.loaded', (ev, container) => {
    const containerEl = $(container);
    const textarea = containerEl.find('[component="chat/input"]')[0];
    const addEmojiBtn = containerEl.find('[data-action="emoji"]');

    addEmojiBtn.on('click', (ev) => {
      require([
        'emoji-dialog'
      ], function (emojiDialog) {
          emojiDialog.toggleForInsert(textarea, 0, 0, ev);
      });
    });
  });
});
