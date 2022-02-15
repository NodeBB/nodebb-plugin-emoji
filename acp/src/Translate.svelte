<script lang="ts">
  import { Translator } from 'translator';

  const translator = Translator.create();

  export let src: string;
</script>

{#await translator.translate(src) then translated}
{@html translated}
{/await}
