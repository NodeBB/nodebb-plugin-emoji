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

<button id="edit" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" style="
    left: 30px;
    margin-left: 0;
    background: rgb(255,64,129) !important;
">
	<i class="material-icons">edit</i>
</button>

<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="editModalLabel">Customize Emoji</h4>
      </div>
      <div class="modal-body" id="editModalBody">
        
      </div>
    </div>
  </div>
</div>
