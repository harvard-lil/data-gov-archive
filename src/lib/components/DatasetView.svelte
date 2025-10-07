<script>
  import "@fontsource/material-icons";
  import sanitizeHtml from "sanitize-html";
  import { base } from "$app/paths";

  import DatasetMetadata from "./DatasetMetadata.svelte";
  import TagList from "./TagList.svelte";
  import DatasetLinks from "./DatasetLinks.svelte";

  let { dataset } = $props();
  let notes = $derived(sanitizeHtml(dataset.notes, { allowedTags: [] }));
</script>

<article>
  <h2 class="font-bold text-2xl mb-2">{dataset.title}</h2>
  <h3 class="font-normal text-lg mb-4">
    <a
      class="text-inherit no-underline hover:underline"
      href={`${base}/?resource=organizations/${encodeURIComponent(dataset.organization_title)}`}
      >{dataset.organization_title}</a
    >
  </h3>

  <DatasetLinks {dataset} />

  <p class="italic my-4">
    {#if notes}
      {#each notes.split(/\r\n|\r|\n/) as line}
        {line}<br />
      {/each}
    {/if}
  </p>

  <DatasetMetadata {dataset} />
</article>
