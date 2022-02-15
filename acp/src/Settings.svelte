<script lang="ts">
import api from 'api';
import app from 'app';
import { init as initEmoji } from 'emoji';

import Customize from './Customize.svelte';
import Translate from './Translate.svelte';

export let settings: Settings;

function updateSettings() {
  api.put('/admin/plugins/emoji/settings', settings).then(
    () => app.alertSuccess(),
    err => app.alertError(err)
  );
}

function buildAssets() {
  api.put('/admin/plugins/emoji/build', {}).then(
    () => app.alertSuccess(),
    err => app.alertError(err)
  );
}

let openCustomize: () => void;

interface CustomizationsData {
  emojis: {
    [id: number]: CustomEmoji
  };
  adjuncts: {
    [id: number]: CustomAdjunct
  }
}

let customizationsData: Promise<CustomizationsData>;
function getCustomizations(): Promise<CustomizationsData> {
  return api.get('/admin/plugins/emoji/customizations', {});
}
function showCustomize() {
  customizationsData = customizationsData || Promise.all([
    getCustomizations(),
    initEmoji(),
  ]).then(([data]) => data);
  customizationsData.then(() => setTimeout(() => openCustomize(), 0));
}
</script>

<form id="emoji-settings">
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="form-group">
        <label for="emoji-parseAscii">
          <input id="emoji-parseAscii" type="checkbox" bind:checked={settings.parseAscii} />
          <Translate src="[[admin/plugins/emoji:settings.parseAscii]]"/>
        </label>
      </div>

      <div class="form-group">
        <label for="emoji-parseNative">
          <input id="emoji-parseNative" type="checkbox" bind:checked={settings.parseNative} />
          <Translate src="[[admin/plugins/emoji:settings.parseNative]]"/>
        </label>
      </div>

      <div class="form-group">
        <label for="emoji-customFirst">
          <input id="emoji-customFirst" type="checkbox" bind:checked={settings.customFirst} />
          <Translate src="[[admin/plugins/emoji:settings.customFirst]]"/>
        </label>
      </div>
    </div>

    <div class="panel-footer">
      <div class="form-group">
        <button type="button" on:click={buildAssets} class="btn btn-primary" aria-describedby="emoji-build_description"><Translate src="[[admin/plugins/emoji:build]]"/></button>
        <p id="emoji-build_description" class="help-block">
        <Translate src="[[admin/plugins/emoji:build_description]]"/>
        </p>
      </div>
    </div>
  </div>
</form>

{#if customizationsData}
{#await customizationsData then customizations}
<Customize bind:show={openCustomize} data={customizations} />
{/await}
{/if}

<button on:click={updateSettings} class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
  <i class="material-icons">save</i>
</button>

<button on:click={showCustomize} class="edit floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
  <i class="material-icons">edit</i>
</button>

<style>
button.floating-button.edit {
  left: 30px;
  margin-left: 0;
  background: #ff4081 !important;
}
</style>
