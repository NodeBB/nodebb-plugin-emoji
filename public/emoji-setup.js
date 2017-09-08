require(['emoji'], (emoji) => {
  $(window).on('composer:autocomplete:init chat:autocomplete:init', (e, data) => {
    emoji.init();
    data.strategies.push(emoji.strategy);
  });
});