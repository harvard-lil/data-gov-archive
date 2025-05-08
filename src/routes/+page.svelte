<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov</title>
</svelte:head>

<PageNav pageNumber={1} totalItems={data.datasets.length} />
<DatasetList datasets={data.datasets} />
