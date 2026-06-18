<script>
  import DatasetListItem from "./DatasetListItem.svelte";

  let { datasets = [], showOrganization, loading = false, count = 8 } = $props();
</script>

<ul aria-hidden={loading ? "true" : undefined}>
  {#if loading}
    {#each Array.from({ length: count }, (_, i) => i) as i (i)}
      <DatasetListItem {showOrganization} loading />
    {/each}
  {:else}
    {#each datasets as dataset (dataset.name)}
      <DatasetListItem {dataset} {showOrganization} />
    {/each}
  {/if}
</ul>
