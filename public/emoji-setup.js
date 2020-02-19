/* eslint-disable prefer-arrow-callback, func-names, strict, no-var */
/* eslint-disable vars-on-top, no-plusplus, no-bitwise, no-multi-assign */
/* eslint-disable no-nested-ternary, no-labels, no-restricted-syntax */
/* eslint-disable no-continue, import/no-amd, import/no-dynamic-require */
/* eslint-disable prefer-template, global-require */

require(['emoji'], function (emoji) {
  $(window).on('composer:autocomplete:init chat:autocomplete:init', function (e, data) {
    emoji.init();
    data.strategies.push(emoji.strategy);
  });
});
