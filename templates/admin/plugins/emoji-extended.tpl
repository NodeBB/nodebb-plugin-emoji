<h1>Emoji Extended</h1>
<hr />

<form id="emoji-settings">
  <div class="alert alert-info">
    <p>
      <div class="pull-left" style="line-height:30px">Maximum amount of text-completion entries: &nbsp;</div>
      <input type="number" data-key="maxCount" title="Maximum entries" style="width:50px">
      <div class="clearfix"> </div>

      <div class="pull-left" style="line-height:30px">
        RegExp to check whether to show completion-box:
        <code>/^[\s\S]*(</code>
        <input type="text" data-key="completePrefix" title="RegExp prefix" style="line-height:normal;font-family:'Courier New',monospace;">
        <code>):/i</code>
      </div>
      <div class="clearfix"> </div>

      <div class="pull-left" style="line-height:30px">Minimum amount of characters after <code>:</code> for text-completion: &nbsp;</div>
      <input type="number" data-key="minChars" title="Minimum characters" style="width:50px">
      <div class="clearfix"> </div>

      <div class="pull-left" style="line-height:30px">Zoom-size of emoji (0 to disable): &nbsp;</div>
      <input type="number" max="512" data-key="zoom" title="Zoom-size (in px)" style="width:60px">
      <div class="clearfix"> </div>

      <div class="pull-left">Enable emoticon-mapping, overwrites specific emoji-skype emoticons if enabled &nbsp; </div>
      <input type="checkbox" data-key="killSkype" title="Enable Mapping">

      <div class="clearfix"> </div>
    </p>
  </div>
  <button class="btn btn-lg btn-warning" id="reset">Reset</button>
  <button class="btn btn-lg btn-primary" id="save">Save</button>
</form>

<script>
  require(['settings'], function(settings) {
    var wrapper = $("#emoji-settings");
    settings.sync('emoji-extended', wrapper);
    $('#save').click(function(event) {
      event.preventDefault();
      settings.persist('emoji-extended', wrapper, function(){
        socket.emit('admin.settings.syncEmojiExtended');
      });
    });
    $('#reset').click(function(event) {
      event.preventDefault();
      socket.emit('admin.settings.getEmojiExtendedDefaults', null, function (err, data) {
        settings.set('emoji-extended', data, wrapper, function(){
          socket.emit('admin.settings.syncEmojiExtended');
        });
      });
    });
  });
</script>