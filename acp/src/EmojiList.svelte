<script lang="ts">
import api from 'api';
import * as alerts from 'alerts';
import Emoji from './Emoji.svelte';

export let emojis: {
  [id: number]: CustomEmoji,
};

let emojiList: { id: number, emoji: CustomEmoji }[];
$: {
  emojiList = Object.keys(emojis).map(key => ({ id: parseInt(key, 10), emoji: emojis[key] }));
}

function onEdit(event: CustomEvent<{ id: number, emoji: CustomEmoji }>) {
  const { id, emoji } = event.detail;
  api.put(`/admin/plugins/emoji/customizations/emoji/${id}`, { item: emoji }).then(() => {
    emojis = {
      ...emojis,
      [id]: emoji,
    };
  }, () => alerts.error());
}
function onDelete(event: CustomEvent<{ id: number }>) {
  const { id } = event.detail;
  api.del(`/admin/plugins/emoji/customizations/emoji/${id}`, {}).then(() => {
    delete emojis[id];
    emojis = { ...emojis };
  }, () => alerts.error());
}

const blank = {
  name: '',
  image: '',
  aliases: [],
  ascii: [],
};

let resetNew: () => void;
let newEmoji = { ...blank };
function onAdd(event: CustomEvent<{ id: -1, emoji: CustomEmoji }>) {
  const { emoji } = event.detail;

  api.post('/admin/plugins/emoji/customizations/emoji', { item: emoji }).then(({ id }) => {
    emojis = {
      ...emojis,
      [id]: emoji,
    };

    newEmoji = { ...blank };
    resetNew();
  }, () => alerts.error());
}
</script>

<table class="table">
  <thead>
    <tr><th>Name</th><th>Image</th><th>Aliases</th><th>ASCII patterns</th><th></th></tr>
  </thead>
  <tbody>
    {#each emojiList as item (item.id)}
      <Emoji {...item} on:save={onEdit} on:delete={onDelete} />
    {/each}
  </tbody>
  <tfoot>
    <Emoji bind:reset={resetNew} id={-1} emoji={newEmoji} on:save={onAdd} />
  </tfoot>
</table>
