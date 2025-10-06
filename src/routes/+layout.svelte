<script>
  import "@fontsource-variable/public-sans";
  import "@fontsource-variable/public-sans/wght-italic";

  import { DATA_URL } from "$lib/config.js";
  import { queryData, cleanup } from "$lib/db.js";
  import FilterNav from "$lib/FilterNav.svelte";
  import Header from "$lib/Header.svelte";
  import SearchBox from "$lib/SearchBox.svelte";
  import LoadingSpinner from "$lib/LoadingSpinner.svelte";
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  export const loadData = async () => {
    // Only run queries in the browser
    if (!browser) {
      return { organizations: [], publishers: [], bureaus: [], tags: [] };
    }

    const organizations = await queryData(`
      SELECT identifier AS organization_title, count
      FROM '${DATA_URL}/aggregations.parquet'
      WHERE aggregation = 'organizations'
      ORDER BY count DESC
      LIMIT 10;
    `);
    const publishers = await queryData(`
      SELECT identifier AS publisher, count
      FROM '${DATA_URL}/aggregations.parquet'
      WHERE aggregation = 'publishers'
      ORDER BY count DESC
      LIMIT 10;
    `);
    const bureaus = await queryData(`
      SELECT identifier AS bureau_name, count
      FROM '${DATA_URL}/aggregations.parquet'
      WHERE aggregation = 'bureaus'
      ORDER BY count DESC
      LIMIT 10;
    `);
    const tags = await queryData(`
      SELECT identifier AS tag, count
      FROM '${DATA_URL}/aggregations.parquet'
      WHERE aggregation = 'tags'
      ORDER BY count DESC
      LIMIT 10;
    `);

    return { organizations, publishers, bureaus, tags };
  };

  let topNFilters = loadData();

  const { children } = $props();

  // Cleanup database connections when component is destroyed
  onDestroy(() => {
    cleanup();
  });
</script>

<Header />

{#await topNFilters}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
{:then topNFilters}
  <FilterNav
    organizations={topNFilters.organizations}
    publishers={topNFilters.publishers}
    bureaus={topNFilters.bureaus}
    tags={topNFilters.tags}
  />
{/await}

<main>
  {@render children?.()}
</main>

<style lang="scss">
  :global(body) {
    background-color: #ddd;
    color: #222;

    margin: 0 auto;
    padding: 0 1.5em 1.5em;
    max-width: 54em;

    font-family: "Public Sans Variable", sans-serif;
    font-weight: 400;

    /* Grid system */
    display: grid;
    grid-template-columns: 16em 36em;
    grid-template-rows: max-content 1fr;
    gap: 0 2em;
    grid-template-areas:
      "a a"
      "b c";
  }

  main {
    grid-area: c;
  }
</style>
