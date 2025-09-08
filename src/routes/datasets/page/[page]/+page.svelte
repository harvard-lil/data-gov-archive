<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";

  let data = $state({
    datasets: [],
    totalItems: 0,
    pageNumber: 1,
  });

  // Load data when page changes
  $effect(async () => {
    try {
      const pageNumber = parseInt($page.params.page);
      const offset = (pageNumber - 1) * 200;

      const datasetsCount = await queryData(`
        SELECT count(*) AS count
        FROM parquet_scan('datasets.parquet')
      `);

      const totalPages = Math.ceil(Number(datasetsCount[0].count) / 200);

      if (pageNumber <= 0 || pageNumber > totalPages) {
        // Handle invalid page - could redirect or show error
        return;
      }

      const datasets = await queryData(`
        SELECT *
        FROM parquet_scan('datasets.parquet')
        ORDER BY name
        LIMIT 200
        OFFSET ${offset}
      `);

      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0].count);
      data.pageNumber = pageNumber;
    } catch (error) {
      console.error("Error loading datasets:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: Datasets, page {data.pageNumber}</title>
</svelte:head>

{#if data.totalItems > 0}
  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />
{:else}
  <p>Loading datasets...</p>
{/if}
