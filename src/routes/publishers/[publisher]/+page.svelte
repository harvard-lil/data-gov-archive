<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.publisher}</title>
</svelte:head>

<h2>Publisher: {data.publisher}</h2>
<DatasetList datasets={data.datasets} />
