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

<div class="modal fade" bind:this={modal} tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="editModalLabel">Customize Emoji</h4>
      </div>
      <div class="modal-body">
        <p>
          Below you can add custom emoji, and also add new aliases
          and ASCII patterns for existing emoji. While this list is
          edited live, you must still <strong>Build Emoji Assets </strong>
          to actually use these customizations.
        </p>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">Custom Emoji</h3>
          </div>
          <EmojiList emojis={data.emojis} />
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">Custom Extensions</h3>
          </div>
          <ItemList record={data.adjuncts} />
        </div>
      </div>
    </div>
  </div>
</div>

<svelte:head>
  <link rel="stylesheet" href={`${config.assetBaseUrl}/plugins/nodebb-plugin-emoji/emoji/styles.css?${config['cache-buster']}`} />
</svelte:head>
