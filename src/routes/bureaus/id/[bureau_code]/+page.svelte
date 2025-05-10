<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();

  let bureauLabel = $derived(
    data.bureau_name ? `${data.bureau_name} (${data.bureau_code})` : data.bureau_code
  );
</script>

<svelte:head>
  <title>Archive of Data.gov: {bureauLabel}</title>
</svelte:head>

<h2>
  <b>Bureau:</b>
  {bureauLabel}
</h2>
<DatasetList datasets={data.datasets} />

<style lang="scss">
  h2 {
    font-weight: inherit;
  }
</style>
