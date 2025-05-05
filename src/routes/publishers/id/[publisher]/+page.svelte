<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.publisher}</title>
</svelte:head>

<h2><b>Publisher:</b> {data.publisher}</h2>
<DatasetList datasets={data.datasets} />

<style lang="scss">
  h2 {
    font-weight: inherit;
  }
</style>
