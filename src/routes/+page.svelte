<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { browser } from "$app/environment";
  import { getSearchContext } from "$lib/search.js";
  import { PAGE_SIZE } from "$lib/config.js";

  let data = $state({
    datasets: [],
    totalItems: 0,
  });

  // Get search context
  const searchContext = getSearchContext();

  // Load data on component mount and react to search state changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    // Access search state to make this effect reactive to search changes
    const searchState = searchContext.searchState;

    // Don't load default data if we're showing search results
    if (searchState.isSearchResults) {
      data.datasets = searchState.results;
      data.totalItems = searchState.totalResults;
      return;
    }

    try {
      const datasetsCount = await queryData(`
        SELECT count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = 'datasets'
      `);
      const datasets = await queryData(`
        SELECT name, title, notes, organization_name, organization_title
        FROM read_parquet('datasets_page_1.parquet')
        LIMIT ${PAGE_SIZE}
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

{#if searchContext.searchState.isSearchResults}
  {#if searchContext.searchState.isSearching}
    <p>Loading…</p>
  {:else}
    <h2><b>Search:</b> {searchContext.searchState.searchQuery}</h2>
    {#if data.totalItems > 0}
      <p>
        {data.totalItems.toLocaleString("en-US")} result{data.totalItems === 1 ? "" : "s"} found
      </p>
      <DatasetList datasets={data.datasets} />
    {:else}
      <p>No results found</p>
    {/if}
  {/if}
{:else if data.totalItems > 0}
  <PageNav pageNumber={1} totalItems={data.totalItems} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={1} totalItems={data.totalItems} />
{:else}
  <p>Loading datasets…</p>
{/if}

<style lang="scss">
  h2 {
    font-weight: inherit;
  }
</style>
