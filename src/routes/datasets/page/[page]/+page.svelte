<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();

  let offset = (data.pageNumber - 1) * 200;
</script>

<svelte:head>
  <title>Archive of Data.gov: Datasets, page {data.pageNumber}</title>
</svelte:head>

<PageNav pageNumber={data.pageNumber} totalItems={data.datasets.length} />

<DatasetList datasets={data.datasets} offset={data.pageNumber - 1} />

<PageNav pageNumber={data.pageNumber} totalItems={data.datasets.length} />
