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
  <div class="card">
    <div class="card-body">
      <div class="mb-3">
        <div class="form-check">
          <input id="emoji-parseAscii" type="checkbox" bind:checked={settings.parseAscii} class="form-check-input"/>
          <label class="form-check-label" for="emoji-parseAscii"><Translate src="[[admin/plugins/emoji:settings.parseAscii]]"/></label>
        </div>
      </div>

      <div class="mb-3">
        <div class="form-check">
          <input id="emoji-parseNative" type="checkbox" bind:checked={settings.parseNative} class="form-check-input" />
          <label class="form-check-label" for="emoji-parseNative"><Translate src="[[admin/plugins/emoji:settings.parseNative]]"/></label>
        </div>
      </div>

      <div class="mb-3">
        <div class="form-check">
          <input id="emoji-customFirst" type="checkbox" bind:checked={settings.customFirst} class="form-check-input"/>
          <label class="form-check-label" for="emoji-customFirst"><Translate src="[[admin/plugins/emoji:settings.customFirst]]"/></label>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="mb-3">
        <button type="button" on:click={buildAssets} class="btn btn-primary" aria-describedby="emoji-build_description"><Translate src="[[admin/plugins/emoji:build]]"/></button>
        <p id="emoji-build_description" class="form-text">
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

<button on:click={updateSettings} id="save" class="btn btn-primary position-fixed bottom-0 end-0 px-3 py-2 mb-4 me-4 rounded-circle fs-4" type="button" style="width: 64px; height: 64px;">
  <i class="fa fa-fw fas fa-floppy-disk"></i>
</button>

<button on:click={showCustomize} class="edit btn btn-primary position-fixed bottom-0 end-0 px-3 py-2 mb-4 me-4 rounded-circle fs-4" type="button" style="width: 64px; height: 64px;">
  <i class="fa fa-fw fas fa-pencil"></i>
</button>

<style>
button.edit {
  left: 30px;
  margin-left: 0;
  background: #ff4081 !important;
}
</style>
