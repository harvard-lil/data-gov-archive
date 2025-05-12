<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.organization_title}, page {data.pageNumber}</title>
</svelte:head>

<h2><b>Organization:</b> {data.organization_title}</h2>

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="organizations/id/{data.organization_name}"
/>

<DatasetList datasets={data.datasets} />

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="organizations/id/{data.organization_name}"
/>

<style lang="scss">
  h2 {
    font-weight: inherit;
  }
</style>
