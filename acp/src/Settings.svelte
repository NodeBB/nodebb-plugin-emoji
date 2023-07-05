<script lang="ts">
import api from 'api';
import * as alerts from 'alerts';
import { init as initEmoji } from 'emoji';

import Customize from './Customize.svelte';
import Translate from './Translate.svelte';

export let settings: Settings;

function updateSettings() {
  api.put('/admin/plugins/emoji/settings', settings).then(
    () => alerts.success(),
    err => alerts.error(err)
  );
}

function buildAssets() {
  api.put('/admin/plugins/emoji/build', {}).then(
    () => alerts.success(),
    err => alerts.error(err)
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

<!-- eslint-disable max-len -->
<div class="acp-page-container">
  <!-- @ts-ignore -->
  <div
    component="settings/main/header"
    class="row border-bottom py-2 m-0 sticky-top acp-page-main-header align-items-center"
  >
    <div class="col-12 col-md-8 px-0 mb-1 mb-md-0">
      <h4 class="fw-bold tracking-tight mb-0">Emoji</h4>
    </div>
    <div class="col-12 col-md-4 px-0 px-md-3 text-end">
      <button
        on:click={showCustomize}
        class="edit btn btn-light btn-sm fw-semibold ff-secondary text-center text-nowrap"
        type="button"
      >Customize</button>
      <button
        on:click={updateSettings}
        class="btn btn-primary btn-sm fw-semibold ff-secondary text-center text-nowrap"
        type="button"
      >Save Changes</button>
    </div>
  </div>

  <form id="emoji-settings">
    <div class="card">
      <div class="card-body">
        <div class="mb-3">
          <div class="form-check">
            <input
              id="emoji-parseAscii"
              type="checkbox"
              bind:checked={settings.parseAscii}
              class="form-check-input"
            />
            <label class="form-check-label" for="emoji-parseAscii">
              <Translate src="[[admin/plugins/emoji:settings.parseAscii]]"/>
            </label>
          </div>
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              id="emoji-parseNative"
              type="checkbox"
              bind:checked={settings.parseNative}
              class="form-check-input"
            />
            <label class="form-check-label" for="emoji-parseNative">
              <Translate src="[[admin/plugins/emoji:settings.parseNative]]"/>
            </label>
          </div>
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              id="emoji-customFirst"
              type="checkbox"
              bind:checked={settings.customFirst}
              class="form-check-input"
            />
            <label class="form-check-label" for="emoji-customFirst">
              <Translate src="[[admin/plugins/emoji:settings.customFirst]]"/>
            </label>
          </div>
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              id="emoji-parseTitles"
              type="checkbox"
              bind:checked={settings.parseTitles}
              class="form-check-input"
            />
            <label class="form-check-label" for="emoji-parseTitles">
              <Translate src="[[admin/plugins/emoji:settings.parseTitles]]"/>
            </label>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <div class="mb-3">
          <button
            type="button"
            on:click={buildAssets}
            class="btn btn-primary"
            aria-describedby="emoji-build_description"
          >
            <Translate src="[[admin/plugins/emoji:build]]"/>
          </button>
          <p id="emoji-build_description" class="form-text">
          <Translate src="[[admin/plugins/emoji:build_description]]"/>
          </p>
        </div>
      </div>
    </div>
  </form>
</div>

{#if customizationsData}
{#await customizationsData then customizations}
<Customize bind:show={openCustomize} data={customizations} />
{/await}
{/if}
