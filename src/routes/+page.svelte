<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";

  let data = $state({
    datasets: [],
    totalItems: 0,
  });

  // Load data on component mount
  $effect(async () => {
    try {
      const datasetsCount = await queryData(
        "SELECT count(*) AS count FROM parquet_scan('datasets.parquet')"
      );
      const datasets = await queryData(`
        SELECT *
        FROM parquet_scan('datasets.parquet')
        ORDER BY name
        LIMIT 200
      `);

      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0].count);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov</title>
</svelte:head>

{#if data.totalItems > 0}
  <PageNav pageNumber={1} totalItems={data.totalItems} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={1} totalItems={data.totalItems} />
{:else}
  <p>Loading datasets...</p>
{/if}
