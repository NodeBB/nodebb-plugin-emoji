<div class="emoji-dialog" id="emoji-dialog">
  <div class="emoji-tabs">
    <div class="top-bar"></div>

    <div class="emoji-dialog-search-container">
      <div class="input-group">
        <input type="text" class="form-control emoji-dialog-search" placeholder="[[emoji:search.placeholder]]">

        <button type="button" class="close btn btn-outline-secondary" data-bs-dismiss="modal" aria-label="[[global:close]]">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="emoji-dialog-search-results hidden nav-item">
        <a href="#emoji-tab-search" class="nav-link" aria-controls="search" role="tab" data-bs-toggle="tab" data-ajaxify="false">
          [[emoji:search.results]]
        </a>
      </li>

      {{{ each categories }}}
      <li role="presentation" class="nav-item">
        <a href="#emoji-tab-{./name}" class="nav-link {{{ if @first }}}active{{{ end }}}" aria-controls="{./name}" role="tab" data-bs-toggle="tab" data-ajaxify="false">
          [[emoji:categories.{./name}]]
        </a>
      </li>
      {{{ end }}}

      <li role="presentation" class="nav-item">
        <button href="#emoji-tab-legal" class="nav-link" class="btn btn-info" aria-controls="legal" role="tab" data-bs-toggle="tab" data-ajaxify="false">
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
        <div class="row">
          <div class="col-12 mb-3">
            <p class="lead">
              [[emoji:modal.legal.header]]
            </p>
          </div>
          {{{ each packs }}}
          <div class="col-12 mb-3">
            <h3>[[emoji:modal.legal.set.header, {../name}, {../id}]]</h3>

            {{{ if ./attribution }}}
            <div class="mb-3">
              <h4>[[emoji:modal.legal.set.attribution]]</h4>
              <div class="card card-body text-bg-light">
                {./attribution}
              </div>
            </div>
            {{{ end }}}

            {{{ if ./license }}}
            <div class="mb-3">
              <h4>[[emoji:modal.legal.set.license]]</h4>
              <div class="card card-body text-bg-light">
                {./license}
              </div>
            </div>
            {{{ end }}}
          </div>
          {{{ end }}}
        </div>
      </div>
    </div>
  </div>
</div>
