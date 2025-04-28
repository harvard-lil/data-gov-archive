<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";

  let { data } = $props();
</script>

<h1>{data.organization_title}</h1>
<DatasetList datasets={data.datasets} showOrganization={false} />
