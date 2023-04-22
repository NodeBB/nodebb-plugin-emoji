<script lang="ts">
import api from 'api';
import * as alerts from 'alerts';
import Adjunct from './Adjunct.svelte';

type ItemType = CustomAdjunct;
export let type = 'adjunct';
export let record: {
  [id: number]: ItemType,
};

let list: { id: number, item: ItemType }[];
$: {
  list = Object.keys(record).map(key => ({ id: parseInt(key, 10), item: record[key] }));
}

function onEdit(event: CustomEvent<{ id: number, item: CustomAdjunct }>) {
  const { id, item } = event.detail;
  api.put(`/admin/plugins/emoji/customizations/${type}/${id}`, { item }).then(() => {
    record = {
      ...record,
      [id]: item,
    };
  }, () => alerts.error());
}
function onDelete(event: CustomEvent<{ id: number }>) {
  const { id } = event.detail;
  api.del(`/admin/plugins/emoji/customizations/${type}/${id}`, {}).then(() => {
    delete record[id];
    record = { ...record };
  }, () => alerts.error());
}

const blank = {
  name: '',
  aliases: [],
  ascii: [],
};

let resetNew: () => void;
let newItem = { ...blank };
function onAdd(event: CustomEvent<{ id: -1, item: CustomAdjunct }>) {
  const { item } = event.detail;

  api.post(`/admin/plugins/emoji/customizations/${type}`, { item }).then(({ id }) => {
    record = {
      ...record,
      [id]: item,
    };

    newItem = { ...blank };
    resetNew();
  }, () => alerts.error());
}
</script>

<table class="table">
  <thead>
    <tr><th>Name</th><th>Image</th><th>Aliases</th><th>ASCII patterns</th><th></th></tr>
  </thead>
  <tbody>
    {#each list as item (item.id)}
      <Adjunct {...item} on:save={onEdit} on:delete={onDelete} />
    {/each}
  </tbody>
  <tfoot>
    <Adjunct bind:reset={resetNew} id={-1} item={newItem} on:save={onAdd} />
  </tfoot>
</table>
