<div class="emoji-dialog" id="emoji-dialog">
  <div class="emoji-tabs p-1">
    <div class="emoji-dialog-search-container p-1">
      <div class="input-group">
        <input type="text" class="form-control emoji-dialog-search shadow-none" placeholder="[[emoji:search.placeholder]]">

        <button type="button" class="close btn btn-outline-secondary" aria-label="[[global:close]]">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="emoji-dialog-search-results hidden nav-item m-0">
        <a href="#emoji-tab-search" class="nav-link" aria-controls="search" role="tab" data-bs-toggle="tab" data-ajaxify="false">
          <i class="fa fa-fw fa-search text-muted pe-none"></i>
        </a>
      </li>

      {{{ each categories }}}
      <li role="presentation" class="nav-item m-0">
        {{{ if (./name != "modifier")}}}
        <a href="#emoji-tab-{./name}" class="nav-link {{{ if @first }}}active{{{ end }}}" aria-controls="{./name}" role="tab" data-ajaxify="false" title="[[emoji:categories.{./name}]]">
          <!-- [[emoji:categories.{./name}]] -->
          {{{ if (./name == "people" )}}}<i class="fa fa-fw fa-smile text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "nature" )}}}<i class="fa fa-fw fa-leaf text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "food" )}}}<i class="fa fa-fw fa-burger text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "activity" )}}}<i class="fa fa-fw fa-football text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "travel" )}}}<i class="fa fa-fw fa-plane-departure text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "objects" )}}}<i class="fa-regular fa-fw fa-lightbulb text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "symbols" )}}}<i class="fa fa-fw fa-peace text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "flags" )}}}<i class="fa fa-fw fa-flag text-muted pe-none"></i>{{{ end }}}
          {{{ if (./name == "custom" )}}}<i class="fa fa-fw fa-superpowers text-muted pe-none"></i>{{{ end }}}
        </a>
        {{{ end }}}
      </li>
      {{{ end }}}

      <li role="presentation" class="nav-item hidden">
        <button href="#emoji-tab-legal" class="nav-link text-bg-info" aria-controls="legal" role="tab" data-bs-toggle="tab" data-ajaxify="false">
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
