import jQuery from 'jquery';
import ajaxify from 'ajaxify';

import Settings from './Settings.svelte';

jQuery(window).on('action:ajaxify.end', () => {
  if (ajaxify.data.template['admin/plugins/emoji']) {
    // eslint-disable-next-line no-new
    new Settings({
      target: document.getElementById('content'),
      props: {
        settings: ajaxify.data.settings,
      },
    });
  }
});
