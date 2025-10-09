<script>
  import sanitizeHtml from "sanitize-html";
  import { base } from "$app/paths";

  import DatasetLinks from "./DatasetLinks.svelte";
  import DatasetMetadata from "./DatasetMetadata.svelte";

  let { dataset } = $props();
  let notes = $derived(sanitizeHtml(dataset.notes, { allowedTags: [] }));
</script>

<article>
  <h2 class="font-bold text-xl mb-2">{dataset.title}</h2>
  <div class="font-normal text-lg mb-6">
    <a
      class="text-inherit no-underline hover:underline"
      href={`${base}/?resource=organizations/${encodeURIComponent(dataset.organization_title)}`}
      >{dataset.organization_title}</a
    >
  </div>

  <DatasetLinks {dataset} />

  {#if notes}
    {@const paragraphs = notes.split(/\n\n|\r\n\r\n/)}
    <div class="italic my-6">
      {#each paragraphs as paragraph}
        {@const lines = paragraph.split(/\n|\r\n/)}
        {#if lines[0]}
          <p class="mb-4 last:mb-0">
            {#if lines.length > 1}
              {#each lines as line}
                {line}<br />
              {/each}
            {:else}
              {lines[0]}
            {/if}
          </p>
        {/if}
      {/each}
    </div>
  {/if}

  <DatasetMetadata {dataset} />
</article>
