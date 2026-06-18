<script>
  import sanitizeHtml from "sanitize-html";
  import { resolve } from "$app/paths";

  import DatasetLinks from "./DatasetLinks.svelte";
  import DatasetMetadata from "./DatasetMetadata.svelte";
  import Skeleton from "./Skeleton.svelte";

  let { dataset = null, loading = false } = $props();
  let notes = $derived(loading ? "" : sanitizeHtml(dataset.notes, { allowedTags: [] }));
</script>

{#if loading}
  <article aria-busy="true" aria-hidden="true">
    <Skeleton class="h-7 w-3/4 mb-2" />
    <Skeleton class="h-6 w-1/2 mb-6" />
    <Skeleton class="h-4 w-full mb-2" />
    <Skeleton class="h-4 w-full mb-2" />
    <Skeleton class="h-4 w-5/6 mb-6" />
    <Skeleton class="h-4 w-2/3 mb-2" />
    <Skeleton class="h-4 w-1/2 mb-2" />
    <Skeleton class="h-4 w-1/2" />
  </article>
{:else}
  <article>
    <h2 class="font-bold text-xl mb-2">{dataset.title}</h2>
    <div class="font-normal text-lg mb-6">
      <a
        class="text-inherit no-underline hover:underline"
        href={resolve(`/?resource=organizations/${encodeURIComponent(dataset.organization_title)}`)}
        >{dataset.organization_title}</a
      >
    </div>

    <DatasetLinks {dataset} />

    {#if notes}
      {@const paragraphs = notes.split(/\n\n|\r\n\r\n/)}
      <div class="italic my-6 hyphens-auto">
        {#each paragraphs as paragraph, i (i)}
          {@const lines = paragraph.split(/\n|\r\n/)}
          {#if lines[0]}
            <p class="mb-4 last:mb-0">
              {#if lines.length > 1}
                {#each lines as line, i (i)}
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
{/if}
