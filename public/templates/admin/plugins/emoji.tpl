<form id="emoji-settings">
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="form-group">
        <label for="emoji-parseAscii">
          <input id="emoji-parseAscii" type="checkbox" <!-- IF settings.parseAscii --> checked <!-- ENDIF settings.parseAscii --> />
          [[admin/plugins/emoji:settings.parseAscii]]
        </label>
      </div>

      <div class="form-group">
        <label for="emoji-parseNative">
          <input id="emoji-parseNative" type="checkbox" <!-- IF settings.parseNative --> checked <!-- ENDIF settings.parseNative --> />
          [[admin/plugins/emoji:settings.parseNative]]
        </label>
      </div>
    </div>

    <div class="panel-footer">
      <div class="form-group">
        <button type="button" id="build" class="btn btn-primary" aria-describedby="emoji-build_description">[[admin/plugins/emoji:build]]</button>
        <p id="emoji-build_description" class="help-block">
        [[admin/plugins/emoji:build_description]]
        </p>
      </div>
    </div>
  </div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
