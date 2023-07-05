<script lang="ts">
  import { Translator } from 'translator';

  const translator = Translator.create();

  export let src: string;
</script>

{#await translator.translate(src) then translated}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html translated}
{/await}
