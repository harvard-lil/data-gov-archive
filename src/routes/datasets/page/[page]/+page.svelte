<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: Datasets, page {data.pageNumber}</title>
</svelte:head>

<PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />

<DatasetList datasets={data.datasets} />

<PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />
