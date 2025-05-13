<script>
  import DatasetView from "$lib/DatasetView.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.dataset.title}</title>
</svelte:head>

<DatasetView dataset={data.dataset} tags={data.tags} />
