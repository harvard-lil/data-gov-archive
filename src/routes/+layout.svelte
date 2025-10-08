<script>
  import "../app.css";
  import { AGGREGATION_COUNT, DATA_URL } from "$lib/config.js";
  import { queryData, cleanup } from "$lib/db.js";
  import FilterNav from "$lib/components/FilterNav.svelte";
  import Header from "$lib/components/Header.svelte";
  import SearchBox from "$lib/components/SearchBox.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import Footer from "$lib/components/Footer.svelte";
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

<div class="mx-auto my-0 min-h-screen max-w-225 p-6">
  <Header />

  {#await topNFilters}
    <LoadingSpinner />
  {:then topNFilters}
    {#if $mainContentLoading}
      <LoadingSpinner />
    {/if}

    <main class="mt-8 flex flex-col gap-8 md:flex-row md:gap-12">
      <section
        class="md:sticky md:top-2 md:max-h-screen md:flex-2 md:self-start md:overflow-y-auto"
      >
        <FilterNav
          organizations={topNFilters.organizations}
          publishers={topNFilters.publishers}
          bureaus={topNFilters.bureaus}
          tags={topNFilters.tags}
        />
      </section>

      <section class="md:flex-3">
        {@render children?.()}
      </section>
    </main>
  {/await}
</div>

<Footer />
