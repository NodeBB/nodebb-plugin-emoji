<script lang="ts">
import jQuery from 'jquery';
import config from 'config';
import EmojiList from './EmojiList.svelte';
import ItemList from './ItemList.svelte';

export let data: Customizations;

let modal: HTMLElement;

export function show(): void {
  jQuery(modal).modal('show');
}
</script>

<div
  class="modal fade"
  bind:this={modal}
  tabindex="-1"
  role="dialog"
  aria-labelledby="editModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="editModalLabel">Customize Emoji</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
      </div>
      <div class="modal-body">
        <p>
          Below you can add custom emoji, and also add new aliases
          and ASCII patterns for existing emoji. While this list is
          edited live, you must still <strong>Build Emoji Assets </strong>
          to actually use these customizations.
        </p>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Custom Emoji</h3>
          </div>
          <div class="card-body">
            <EmojiList emojis={data.emojis} />
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Custom Extensions</h3>
          </div>
          <div class="card-body">
            <ItemList record={data.adjuncts} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<svelte:head>
  <link rel="stylesheet" href={`${config.assetBaseUrl}/plugins/nodebb-plugin-emoji/emoji/styles.css?${config['cache-buster']}`} />
</svelte:head>
