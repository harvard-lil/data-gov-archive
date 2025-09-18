<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { browser } from "$app/environment";
  import { searchStore } from "$lib/searchStore.js";

  let data = $state({
    datasets: [],
    totalItems: 0,
  });

  let searchState = $state({
    isSearchResults: false,
    searchQuery: "",
    isSearching: false,
  });

  // Subscribe to search store
  $effect(() => {
    const unsubscribe = searchStore.subscribe((store) => {
      searchState.isSearchResults = store.isSearchResults;
      searchState.searchQuery = store.query;
      searchState.isSearching = store.isSearching;

      if (store.isSearchResults) {
        data.datasets = store.results;
        data.totalItems = store.totalResults;
      }
    });
    return unsubscribe;
  });

  // Load data on component mount
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    // Don't load default data if we're showing search results
    if (searchState.isSearchResults) return;

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

{#if searchState.isSearchResults}
  <h2>Search Results for "{searchState.searchQuery}"</h2>
  {#if data.totalItems > 0}
    <p>{data.totalItems} result{data.totalItems === 1 ? "" : "s"} found</p>
    <DatasetList datasets={data.datasets} />
  {:else}
    <p>No results found for "{searchState.searchQuery}"</p>
  {/if}
{:else if data.totalItems > 0}
  <PageNav pageNumber={1} totalItems={data.totalItems} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={1} totalItems={data.totalItems} />
{:else}
  <p>Loading datasets...</p>
{/if}
