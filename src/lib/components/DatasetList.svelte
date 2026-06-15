<script>
  import DatasetListItem from "./DatasetListItem.svelte";

  let { datasets, showOrganization } = $props();
</script>

<ul>
  {#each datasets as dataset (dataset.name)}
    <DatasetListItem {dataset} {showOrganization} />
  {/each}
</ul>
