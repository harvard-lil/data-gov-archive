<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov</title>
</svelte:head>

<p>
  This is the Harvard University Library Innovation Lab's archive of <a href="https://data.gov">
    Data.gov
  </a>
  datasets. For more information, see the
  <a href="https://source.coop/repositories/harvard-lil/gov-data"> project homepage </a> or the
  <a href="https://lil.law.harvard.edu/blog/2025/02/06/announcing-data-gov-archive/">
    project announcement
  </a> on our blog.
</p>

<DatasetList datasets={data.datasets} />
