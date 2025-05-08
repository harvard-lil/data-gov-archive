<script>
  import DatasetListItem from "./DatasetListItem.svelte";

  let { datasets, showOrganization, offset = 0, pageSize = 200 } = $props();
</script>

<ul>
  {#each datasets.slice(offset, offset + pageSize) as dataset}
    <DatasetListItem {dataset} {showOrganization} />
  {/each}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;
  }
</style>
