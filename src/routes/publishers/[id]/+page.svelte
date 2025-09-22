<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  let data = $state({
    datasets: [],
    totalItems: 0,
    pageNumber: 1,
    identifier: "",
    label: "",
  });

  // Load data when identifier or page changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    try {
      const identifier = $page.params.id;
      const url = new URL($page.url);
      const pageParam = url.searchParams.get("page");
      const pageNumber = pageParam ? parseInt(pageParam) : 1;
      const offset = (pageNumber - 1) * 200;

      // Get total count first
      const totalCount = await queryData(
        `
        SELECT count
        FROM parquet_scan('aggregations.parquet')
        WHERE aggregation = 'publishers' AND identifier = $1
      `,
        [identifier]
      );

      const datasets = await queryData(
        `
        SELECT *
        FROM parquet_scan('datasets.parquet')
        WHERE publisher = $1
        ORDER BY name
        LIMIT 200 OFFSET ${offset}
      `,
        [identifier]
      );

      data.datasets = datasets;
      data.totalItems = Number(totalCount[0].count);
      data.pageNumber = pageNumber;
      data.identifier = encodeURIComponent(identifier);
      data.label = datasets[0]?.publisher || identifier;
    } catch (error) {
      console.error("Error loading publisher datasets:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.label || "Loading..."}</title>
</svelte:head>

<h2>
  <b>Publisher:</b>
  {#if data.pageNumber > 1}
    <a href="?page=1">{data.label}</a>
  {:else}
    {data.label}
  {/if}
</h2>

{#if data.totalItems > 0}
  <PageNav
    pageNumber={data.pageNumber}
    totalItems={data.totalItems}
    route="/publishers/{data.identifier}"
  />

  <DatasetList datasets={data.datasets} showOrganization={true} />

  <PageNav
    pageNumber={data.pageNumber}
    totalItems={data.totalItems}
    route="/publishers/{data.identifier}"
  />
{:else}
  <p>Loading datasets for publisher...</p>
{/if}

<style lang="scss">
  h2 {
    font-weight: inherit;

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
</style>
