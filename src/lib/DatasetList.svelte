<script>
  import DatasetListItem from "./DatasetListItem.svelte";

  let { datasets, showOrganization } = $props();
</script>

<ul>
  {#each datasets.slice(0, 100) as dataset}
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
