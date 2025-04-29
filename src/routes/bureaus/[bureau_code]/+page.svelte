<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.bureau_name} ({data.bureau_code})</title>
</svelte:head>

<h2>Bureau: {data.bureau_name} ({data.bureau_code})</h2>
<DatasetList datasets={data.datasets} />
