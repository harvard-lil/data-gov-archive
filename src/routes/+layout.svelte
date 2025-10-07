<script>
  import "../app.css";
  import { AGGREGATION_COUNT, DATA_URL } from "$lib/config.js";
  import { queryData, cleanup } from "$lib/db.js";
  import FilterNav from "$lib/components/FilterNav.svelte";
  import Header from "$lib/components/Header.svelte";
  import SearchBox from "$lib/components/SearchBox.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { mainContentLoading } from "$lib/loadingStore.js";

  export const loadData = async () => {
    // Only run queries in the browser
    if (!browser) {
      return {
        organizations: [],
        publishers: [],
        bureaus: [],
        tags: [],
      };
    }

    const organizations = await queryData(`
        SELECT identifier AS organization_title, count
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = 'organizations'
        ORDER BY count DESC
        LIMIT ${AGGREGATION_COUNT};
      `);

    const publishers = await queryData(`
        SELECT identifier AS publisher, count
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = 'publishers'
        ORDER BY count DESC
        LIMIT ${AGGREGATION_COUNT};
      `);

    const bureaus = await queryData(`
        SELECT identifier AS bureau_name, count
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = 'bureaus'
        ORDER BY count DESC
        LIMIT ${AGGREGATION_COUNT};
      `);

    const tags = await queryData(`
        SELECT identifier AS tag, count
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = 'tags'
        ORDER BY count DESC
        LIMIT ${AGGREGATION_COUNT};
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
  <LoadingSpinner />
{:then topNFilters}
  {#if $mainContentLoading}
    <LoadingSpinner />
  {/if}

  <FilterNav
    organizations={topNFilters.organizations}
    publishers={topNFilters.publishers}
    bureaus={topNFilters.bureaus}
    tags={topNFilters.tags}
  />

  <main>
    {@render children?.()}
  </main>
{/await}

<style lang="scss">
  :global(body) {
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
