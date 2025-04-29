<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.tag}</title>
</svelte:head>

<h2>Tag: <span class="tag">{data.tag}</span></h2>
<DatasetList datasets={data.datasets} />

<style lang="scss">
  span.tag {
    display: inline-block;
    border-radius: 0.25em;
    border: 1px dotted;
    margin-left: 0.25em;
    padding: 0.5em 0.75em;

    font-family: monospace;
    font-weight: 400;
  }
</style>
