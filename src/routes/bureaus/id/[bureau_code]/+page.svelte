<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  {#if data.bureau_name}
    <title>Archive of Data.gov: {data.bureau_name} ({data.bureau_code})</title>
  {:else}
    <title>Archive of Data.gov: {data.bureau_code}</title>
  {/if}
</svelte:head>

<h2>
  {#if data.bureau_name}
    <b>Bureau:</b> {data.bureau_name} ({data.bureau_code})
  {:else}
    <b>Bureau:</b> {data.bureau_code}
  {/if}
</h2>
<DatasetList datasets={data.datasets} />

<style lang="scss">
  h2 {
    font-weight: inherit;
  }
</style>
