<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.organization_title}</title>
</svelte:head>

<h2><b>Organization:</b> {data.organization_title}</h2>
<DatasetList datasets={data.datasets} showOrganization={false} />

<style lang="scss">
  h2 {
    font-weight: inherit;
  }
</style>
