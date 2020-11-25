<div class="emoji-dialog" id="emoji-dialog">
  <div class="emoji-tabs">
    <div class="top-bar"></div>
    
    <div class="emoji-dialog-search-container">
      <input type="text" class="form-control emoji-dialog-search" placeholder="[[emoji:search.placeholder]]">
      
      <button type="button" class="close form-control" data-dismiss="modal" aria-label="[[global:close]]">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
      
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="emoji-dialog-search-results hidden">
        <a href="#emoji-tab-search" aria-controls="search" role="tab" data-toggle="tab" data-ajaxify="false">
          [[emoji:search.results]]
        </a>
      </li>

      {{{ each categories }}}
      <li role="presentation" class="{{{ if @first }}}active{{{ end }}}">
        <a href="#emoji-tab-{./name}" aria-controls="{./name}" role="tab" data-toggle="tab" data-ajaxify="false">
          [[emoji:categories.{./name}]]
        </a>
      </li>
      {{{ end }}}

      <li role="presentation">
        <button href="#emoji-tab-legal" class="btn btn-info" aria-controls="legal" role="tab" data-toggle="tab" data-ajaxify="false">
          [[emoji:modal.legal]]
        </button>
      </li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane emoji-dialog-search-results hidden" id="emoji-tab-search">
        <!-- search results emoji go here -->
      </div>

      {{{ each categories }}}
      <div role="tabpanel" class="tab-pane {{{ if @first }}}active{{{ end }}}" id="emoji-tab-{./name}">
        {{{ each ./emojis }}}
        <a class="emoji-link" name="{./name}" href="#">{./html}</a>
        {{{ end }}}
      </div>
      {{{ end }}}

      <div role="tabpanel" class="tab-pane" id="emoji-tab-legal">
        <div class="col-xs-12">
          <p class="lead">
            [[emoji:modal.legal.header]]
          </p>
        </div>
        {{{ each packs }}}
        <div class="col-xs-12">
          <h3>[[emoji:modal.legal.set.header, {../name}, {../id}]]</h3>

          {{{ if ./attribution }}}
          <h4>[[emoji:modal.legal.set.attribution]]</h4>
          <div class="well">
            {./attribution}
          </div>
          {{{ end }}}

          {{{ if ./license }}}
          <h4>[[emoji:modal.legal.set.license]]</h4>
          <div class="well">
            {./license}
          </div>
          {{{ end }}}
        </div>
        {{{ end }}}
      </div>
    </div>
  </div>
</div>
