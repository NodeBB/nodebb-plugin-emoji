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

      <!-- BEGIN categories -->
      <li role="presentation" class="<!-- IF @first -->active<!-- ENDIF @first -->">
        <a href="#emoji-tab-{../name}" aria-controls="{../name}" role="tab" data-toggle="tab" data-ajaxify="false">
          [[emoji:categories.{../name}]]
        </a>
      </li>
      <!-- END categories -->

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

      <!-- BEGIN categories -->
      <div role="tabpanel" class="tab-pane <!-- IF @first -->active<!-- ENDIF @first -->" id="emoji-tab-{../name}">
        <!-- BEGIN emojis -->
        <a class="emoji-link" name="{../name}" href="#">{../html}</a>
        <!-- END emojis -->
      </div>
      <!-- END categories -->

      <div role="tabpanel" class="tab-pane" id="emoji-tab-legal">
        <div class="col-xs-12">
          <p class="lead">
            [[emoji:modal.legal.header]]
          </p>
        </div>
        <!-- BEGIN packs -->
        <div class="col-xs-12">
          <h3>[[emoji:modal.legal.set.header, {../name}, {../id}]]</h3>

          <!-- IF ../attribution -->
          <h4>[[emoji:modal.legal.set.attribution]]</h4>
          <div class="well">
            {../attribution}
          </div>
          <!-- ENDIF ../attribution -->

          <!-- IF ../license -->
          <h4>[[emoji:modal.legal.set.license]]</h4>
          <div class="well">
            {../license}
          </div>
          <!-- ENDIF ../license -->
        </div>
        <!-- END packs -->
      </div>
    </div>
  </div>
</div>
