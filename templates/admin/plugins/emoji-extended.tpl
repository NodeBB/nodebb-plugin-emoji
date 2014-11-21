<form id="emoji-settings">
  <div class="row">
    <div class="col-lg-9">
      <div class="panel panel-default">
        <div class="panel-heading">
          Emoji Extended Settings
        </div>

        <div class="panel-body">
          <div class="row">

            <div class="col-xs-12 col-md-6 form-group">
              <label>Amount of characters to show text-completion:</label>
              <input class="form-control" type="number" data-key="completion.minChars" title="Minimum characters">
            </div>

            <div class="col-xs-6 col-sm-8 col-md-6 form-group">
              <label>Text-Completion entries:</label>
              <input class="form-control" type="number" data-key="completion.maxCount" title="Maximum entries">
            </div>

            <div class="col-xs-6 col-sm-4 col-md-6 form-group">
              <label>Enable emoji-shortcuts like <code>:-)</code>:</label>
              <div class="input-group">
                <div class="input-group-addon">
                  <input type="checkbox" data-key="mapping.enabled" title="Enable Mapping">
                </div>
              </div>
            </div>

            <div class="col-xs-12 col-md-6 form-group">
              <label>Zoom-size of emoji (0 to disable):</label>
              <input class="form-control" type="number" max="512" data-key="zoom" title="Zoom-size (in px)">
            </div>

            <div class="col-xs-12 form-group">
              <label>Regular Expression to show text-completion:</label>
              <div class="input-group">
                <div class="row input-group-addon">
                  <div class="col-xs-4 col-sm-3 col-md-2 col-lg-3">
                    <code class="text-right form-control" style="border:none;box-shadow:none;">/^[\s\S]*(</code>
                  </div>
                  <div class="col-xs-5 col-sm-7 col-md-8 col-lg-7">
                    <input class="form-control" type="text" data-key="completion.prefix" title="RegExp prefix"
                           style="font-family:'Courier New',monospace;">
                  </div>
                  <div class="col-xs-3 col-sm-2">
                    <code class="form-control" style="border:none;box-shadow:none;">):/i</code>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xs-12">
              <label>Use Emoji Cheat Sheet Images</label>
              <div class="input-group">
                <div class="input-group-addon">
                  <input type="checkbox" data-key="fileSystemAccess" title="Emoji Cheat Sheet Images">
                </div>
              </div>
              Note: The Feature of custom images isn't implemented (yet).<br />
              By disabling above checkbox you ensure no automatic changes within the
              <i>node_modules/nodebb-plugin-emoji-extended/emoji/</i> directory.
              Therefor you may change the images located there and the !index.list file in order to setup your own
              images.<br />
              This will disable the categorization of emoji within the composer-dialog.</br >
              Take care not to update this plugin afterwards without a backup.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-3">
      <div class="panel panel-default">
        <div class="panel-heading">
          Action Panel
        </div>

        <div class="panel-body">
          <div class="form-group">
            <button type="button" class="btn btn-danger form-control" id="reset">
              <i class="fa fa-fw fa-history"></i> Reset Settings
            </button>
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-warning form-control" id="update">
              <i class="fa fa-fw fa-download"></i> Update Images
            </button>
          </div>
          <button type="submit" class="btn btn-primary form-control" accesskey="s" id="save">
            <i class="fa fa-fw fa-save"></i> Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</form>

<script>
  $('#update').click(function(event) {
    event.preventDefault();
    socket.emit('admin.settings.updateEmojiExtended');
  });
  require(['settings'], function(settings) {
    function settingsChanged () {
      var s = settings.get();
      if (s.fileSystemAccess) {
        $('#update').removeClass('disabled');
      } else {
        $('#update').addClass('disabled');
      }
    }
    var wrapper = $("#emoji-settings");
    settings.sync('emoji-extended', wrapper, settingsChanged);
    $('#save').click(function(event) {
      event.preventDefault();
      settings.persist('emoji-extended', wrapper, function() {
        socket.emit('admin.settings.syncEmojiExtended');
        settingsChanged();
      });
    });
    $('#reset').click(function(event) {
      event.preventDefault();
      socket.emit('admin.settings.getEmojiExtendedDefaults', null, function (err, data) {
        settings.set('emoji-extended', data, wrapper, function() {
          socket.emit('admin.settings.syncEmojiExtended');
          settingsChanged();
        });
      });
    });
  });
</script>