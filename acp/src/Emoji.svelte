<script lang="ts">
import * as alerts from 'alerts';
import config from 'config';
import utils from 'utils';
import { createEventDispatcher } from 'svelte';

export let emoji: CustomEmoji;
export let id: number;

import { buildEmoji } from 'emoji';

function deepEquals(a: unknown, b: unknown) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    return a.every((value, index) => deepEquals(value, b[index]));
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }
  if (typeof a === 'object') {
    const keys = Object.keys(a);
    if (Object.keys(b).length !== keys.length) {
      return false;
    }
    return keys.every(key => deepEquals(a[key], b[key]));
  }
  return false;
}

interface Failures {
  nameRequired: boolean,
  imageRequired: boolean,
  nameInvalid: boolean,
  aliasInvalid: boolean,
  any: boolean,
}

let name = emoji.name;
let image = emoji.image;
let aliases = emoji.aliases.slice();
let ascii = emoji.ascii.slice();

export function reset(): void {
  name = emoji.name;
  image = emoji.image;
  aliases = emoji.aliases.slice();
  ascii = emoji.ascii.slice();
}

let imageForm: HTMLFormElement;
let imageInput: HTMLInputElement;
let fileNameInput: HTMLInputElement;

let newAlias = '';
function removeAlias(a: string) {
  aliases = aliases.filter(x => x !== a);
}
function addAlias() {
  if (!newAlias || aliases.includes(newAlias)) {
    return;
  }

  aliases = [...aliases, newAlias];
  newAlias = '';
}

let newAscii = '';
function removeAscii(a: string) {
  ascii = ascii.filter(x => x !== a);
}
function addAscii() {
  if (!newAscii || ascii.includes(newAscii)) {
    return;
  }

  ascii = [...ascii, newAscii];
  newAscii = '';
}

const empty = !emoji.name && !emoji.image && !emoji.aliases.length && !emoji.ascii.length;
let editing = false;
$: editing = !deepEquals({
  name,
  image,
  aliases,
  ascii,
}, emoji);

const failures: Failures = {
  nameRequired: false,
  imageRequired: false,
  nameInvalid: false,
  aliasInvalid: false,
  any: false,
};
const pattern = /[^a-z\-.+0-9_]/i;
$: failures.nameRequired = !name;
$: failures.imageRequired = !image;
$: failures.nameInvalid = pattern.test(name);
$: failures.aliasInvalid = pattern.test(newAlias);
$: failures.any = (
  failures.nameRequired ||
  failures.imageRequired ||
  failures.nameInvalid ||
  failures.aliasInvalid
);

let canSave = false;
$: canSave = editing && !failures.any;

function editImage() {
  imageInput.click();

  jQuery(imageInput).one('change', () => {
    if (!imageInput.files.length) {
      return;
    }

    const fileName = `${utils.generateUUID()}-${imageInput.files[0].name}`;
    fileNameInput.value = fileName;

    jQuery(imageForm).ajaxSubmit({
      headers: {
        'x-csrf-token': config.csrf_token,
      },
      success: () => {
        image = fileName;
        imageInput.value = '';
      },
      error: () => {
        const err = Error('Failed to upload file');
        console.error(err);
        alerts.error(err);
        imageInput.value = '';
      },
    });
  });
}

const dispatch = createEventDispatcher();
function onSave() {
  dispatch('save', {
    id,
    emoji: {
      name,
      image,
      aliases,
      ascii,
    },
  });
}

let deleting = false;
let deleted = false;

function onDelete() {
  deleting = true;
}
function confirmDelete() {
  deleting = false;
  deleted = true;

  setTimeout(() => {
    dispatch('delete', {
      id,
    });
  }, 250);
}
function cancelDelete() {
  deleting = false;
}
</script>

<tr class:fadeout={deleted}>
  <td>
    <input
      type="text"
      class="form-control emoji-name"
      bind:value={name}
    />
  </td>
  <td>
    <button type="button" class="btn btn-outline-secondary" on:click={editImage}>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html buildEmoji({
        character: '',
        pack: 'customizations',
        keywords: [],
        name,
        aliases,
        image,
      })}
    </button>
    <form
      action={`${config.relative_path}/api/admin/plugins/emoji/upload`}
      method="post"
      encType="multipart/form-data"
      style="display: none;"
      bind:this={imageForm}
    >
      <input
        type="file"
        name="emojiImage"
        accept="image/*"
        bind:this={imageInput}
      />
      <input
        type="hidden"
        name="fileName"
        bind:this={fileNameInput}
      />
    </form>
  </td>
  <td>
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        bind:value={newAlias}
      />
      <div class="input-group-addon">
        <button class="btn btn-outline-secondary" on:click={addAlias}>+</button>
      </div>
    </div>
    <span>
      {#each aliases as a}
      <button class="btn btn-info btn-sm" on:click={() => removeAlias(a)}>{a} x</button>
      {/each}
    </span>
  </td>
  <td>
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        bind:value={newAscii}
      />
      <div class="input-group-addon">
        <button class="btn btn-outline-secondary" on:click={addAscii}>+</button>
      </div>
    </div>
    <span>
      {#each ascii as a}
      <button class="btn btn-info btn-sm" on:click={() => removeAscii(a)}>{a} x</button>
      {/each}
    </span>
  </td>
  <td>
    {#if editing || empty}
      <button
        class="btn btn-success"
        type="button"
        on:click={onSave}
        disabled={!canSave}
      >
        <i class="fa fa-check"></i>
      </button>
    {:else}
      <button
        class="btn btn-warning"
        type="button"
        on:click={onDelete}
        disabled={deleting || deleted}
      >
        <i class="fa fa-trash"></i>
      </button>
    {/if}
  </td>
</tr>

{#if deleting || deleted}
<tr class:fadeout={deleted}>
  <td>
    <button
      class="btn btn-outline-secondary"
      type="button"
      disabled={deleted}
      on:click={cancelDelete}
    >Cancel</button>
  </td>
  <td colSpan={3}>
    <span class="help-block">Are you sure you want to delete this emoji?</span>
  </td>
  <td>
    <button
      class="btn btn-danger"
      type="button"
      disabled={deleted}
      on:click={confirmDelete}
    >Yes</button>
  </td>
</tr>
{/if}

{#if editing && failures.nameRequired}
<tr class="text-danger">
  <td colSpan={5}>
    <span><strong>Name</strong> is required</span>
  </td>
</tr>
{/if}

{#if editing && failures.imageRequired}
<tr class="text-danger">
  <td colSpan={5}>
    <span><strong>Image</strong> is required</span>
  </td>
</tr>
{/if}

{#if editing && failures.nameInvalid}
<tr class="text-danger">
  <td colSpan={5}>
    <span><strong>Name</strong> can only contain letters, numbers, and <code>_-+.</code></span>
  </td>
</tr>
{/if}

{#if editing && failures.aliasInvalid}
<tr class="text-danger">
  <td colSpan={5}>
    <span><strong>Aliases</strong> can only contain letters, numbers, and <code>_-+.</code></span>
  </td>
</tr>
{/if}

<style>
tr {
  opacity: 1;
  transition: opacity 200ms ease-in-out;
}
tr.fadeout {
  opacity: 0;
}
input.emoji-name {
  max-width: 125px;
}
</style>
