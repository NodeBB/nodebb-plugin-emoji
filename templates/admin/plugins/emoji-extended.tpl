<h1>Emoji Extended</h1>
<hr />

<form>
  <div class="alert alert-info">
    <p>
      <div class="pull-left" style="line-height:30px">Maximum amount of text-completion entries: &nbsp;</div>
      <input type="number" data-field="emoji:extended:maxCount" title="Maximum entries" style="width:50px" placeholder="8" value="8">
      <div class="clearfix"> </div>

      <div class="pull-left" style="line-height:30px">
        RegExp to check whether to show completion-box:
        <code>/^[\s\S]*(</code>
        <input type="text" data-field="emoji:extended:completePrefix" title="RegExp prefix" style="line-height:normal;font-family:'Courier New',monospace;" placeholder="^|[^\w\d)\]}+\-]" value="^|[^\w\d)\]}+\-]">
        <code>):/i</code>
      </div>
      <div class="clearfix"> </div>

      <div class="pull-left" style="line-height:30px">Minimum amount of characters after <code>:</code> for text-completion: &nbsp;</div>
      <input type="number" data-field="emoji:extended:minChars" title="Minimum characters" style="width:50px" placeholder="0" value="0">
      <div class="clearfix"> </div>

      <div class="pull-left" style="line-height:30px">Zoom-size of emoji (0 to disable): &nbsp;</div>
      <input type="number" max="512" data-field="emoji:extended:zoom" title="Zoom-size (in px)" style="width:60px" placeholder="64" value="64">
      <div class="clearfix"> </div>

      <div class="pull-left">Enable emoticon-mapping, overwrites specific emoji-skype emoticons if enabled &nbsp; </div>
      <input type="checkbox" data-field="emoji:extended:killSkype" title="Enable Mapping">

      <div class="clearfix"> </div>
    </p>
  </div>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
  require(['forum/admin/settings'], function(Settings) {
    Settings.prepare();
  });
</script>