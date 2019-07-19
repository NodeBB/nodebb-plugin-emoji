/* eslint-disable prefer-arrow-callback, func-names, strict, no-var */
/* eslint-disable vars-on-top, no-plusplus, no-bitwise, no-multi-assign */
/* eslint-disable no-nested-ternary, no-labels, no-restricted-syntax */
/* eslint-disable no-continue, import/no-amd, import/no-dynamic-require */
/* eslint-disable prefer-template, global-require */

define('admin/plugins/emoji', [], function () {
  $('#save').on('click', function () {
    var settings = {
      parseAscii: !!$('#emoji-parseAscii').prop('checked'),
      parseNative: !!$('#emoji-parseNative').prop('checked'),
      customFirst: !!$('#emoji-customFirst').prop('checked'),
    };
    $.get(window.config.relative_path + '/api/admin/plugins/emoji/save', { settings: JSON.stringify(settings) }, function () {
      window.app.alertSuccess();
    });
  });

  $('#build').on('click', function () {
    $.get(window.config.relative_path + '/api/admin/plugins/emoji/build', function () {
      window.app.alertSuccess();
    });
  });

  require.config({
    shim: {
      preact: {
        exports: 'preact',
      },
    },
  });

  var addedStyle = false;
  $('#edit').click(function () {
    require(['custom-emoji'], function (customEmoji) {
      customEmoji.init(document.getElementById('editModalBody'), function () {
        $('#editModal').modal({
          backdrop: false,
          show: true,
        });
      });
    });
    if (!addedStyle) {
      addedStyle = true;
      $('head').append(
        '<style>@import "' + window.config.relative_path + '/plugins/nodebb-plugin-emoji/emoji/styles.css";</style>'
      );
    }
  });
});
