<form class="form-horizontal" id="emoji-settings">
  <div class="panel panel-default">
    <div class="panel-body">

      <div class="form-group">
        <label for="emoji-shouldParseAscii" class="col-xs-12 col-sm-6 control-label checkbox-label">
          [[admin/plugins/emoji:settings.shouldParseAscii]]
        </label>
        <div class="col-xs-12 col-sm-6">
          <input id="emoji-shouldParseAscii" class="form-checkbox" type="checkbox" <!-- IF settings.shouldParseAscii --> checked <!-- ENDIF settings.shouldParseAscii --> />
        </div>
      </div>
    </div>

    <div class="panel-footer">
      <div class="form-group">
        <label for="build">
          [[admin/plugins/emoji:build_description]]
        </label>
        <button type="button" id="build" class="btn btn-primary">[[admin/plugins/emoji:build]]</build>
      </div>
    </div>
  </div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
