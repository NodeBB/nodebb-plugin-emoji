define('admin/plugins/emoji', [], function () {
  $('#save').on('click', function () {
    var settings = {
      parseAscii: !!$('#emoji-parseAscii').prop('checked'),
      parseNative: !!$('#emoji-parseNative').prop('checked'),
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
});