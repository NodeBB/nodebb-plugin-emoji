<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import { buildEmoji, strategy, table } from 'emoji';

export let item: CustomAdjunct;
export let id: number;

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

let name = item.name;
let aliases = item.aliases.slice();
let ascii = item.ascii.slice();

export function reset(): void {
  name = item.name;
  aliases = item.aliases.slice();
  ascii = item.ascii.slice();
}

const empty = !item.name && !item.aliases.length && !item.ascii.length;

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

$: emoji = name && table[name];
$: editing = !deepEquals({
  name,
  aliases,
  ascii,
}, item);

interface Failures {
  nameRequired: boolean,
  nameInvalid: boolean,
  aliasInvalid: boolean,
  noChange: boolean,
  any: boolean,
}
const failures: Failures = {
  nameRequired: false,
  nameInvalid: false,
  aliasInvalid: false,
  noChange: false,
  any: false,
};
const pattern = /[^a-z\-.+0-9_]/i;
$: failures.nameRequired = !name;
$: failures.nameInvalid = !table[name];
$: failures.aliasInvalid = pattern.test(newAlias);
$: failures.noChange = !aliases.length && !ascii.length;
$: failures.any = (
  failures.nameRequired ||
  failures.nameInvalid ||
  failures.aliasInvalid ||
  failures.noChange
);

$: canSave = editing && !failures.any;

let nameInput: HTMLInputElement;
onMount(() => {
  const editor = new TextareaEditor(nameInput);
  const completer = new Textcomplete(editor, [{
    ...strategy,
    replace: (data: StoredEmoji) => data.name,
    match: /^(.+)$/,
  }], {
    dropdown: {
      style: { zIndex: 20000 },
    },
  });

  completer.on('selected', () => {
    name = nameInput.value;
  });
});

const dispatch = createEventDispatcher();
function onSave() {
  dispatch('save', {
    id,
    item: {
      name,
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
      bind:this={nameInput}
    />
  </td>
  <td>
    {#if emoji}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html buildEmoji(emoji)}
    {/if}
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
    <span class="help-block">Are you sure you want to delete this extension?</span>
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

{#if editing && failures.nameInvalid}
<tr class="text-danger">
  <td colSpan={5}>
    <span><strong>Name</strong> must be an existing emoji</span>
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

{#if editing && failures.noChange}
<tr class="text-danger">
  <td colSpan={5}>
    <span>Must provide at least one <strong>Alias</strong> or <strong>ASCII Pattern</strong>.</span>
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
