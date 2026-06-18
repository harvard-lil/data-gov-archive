<script>
  import { ExternalLink, FileJson, FolderArchive } from "@lucide/svelte";

  let { dataset } = $props();
</script>

{#snippet link(href, label)}
  <li>
    <a
      class="flex items-center justify-center gap-2 w-full text-inherit text-base no-underline border border-gray-800 rounded-md py-3 px-4 mb-1.5"
      {href}
      target="_blank"
      rel="external noopener"
    >
      {#if label === "Dataset & Metadata (ZIP)"}
        <FolderArchive size={16} strokeWidth={1.5} absoluteStrokeWidth />
      {:else if label === "Metadata Only (JSON)"}
        <FileJson size={16} strokeWidth={1.5} absoluteStrokeWidth />
      {:else if label === "Data.gov Source"}
        <ExternalLink size={16} strokeWidth={1.5} absoluteStrokeWidth />
      {/if}
      {label}
    </a>
  </li>
{/snippet}

<ul class="my-4">
  {@render link(
    `https://source.coop/harvard-lil/gov-data/collections/data_gov/${dataset.name}`,
    "Dataset & Metadata (ZIP)"
  )}
  {@render link(
    `https://source.coop/harvard-lil/gov-data/metadata/data_gov/${dataset.name}`,
    "Metadata Only (JSON)"
  )}
  {@render link(`https://catalog.data.gov/dataset/${dataset.name}`, "Data.gov Source")}
</ul>
