<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.organization_title}</title>
</svelte:head>

<h1>{data.organization_title}</h1>
<DatasetList datasets={data.datasets} showOrganization={false} />
