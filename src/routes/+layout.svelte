<script>
  import "../app.css";
  import { AGGREGATION_COUNT, DATA_URL } from "$lib/config.js";
  import { queryData, cleanup } from "$lib/db.js";
  import FilterNav from "$lib/components/FilterNav.svelte";
  import Header from "$lib/components/Header.svelte";
  import SearchBox from "$lib/components/SearchBox.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import SkipLink from "$lib/components/SkipLink.svelte";
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
      };
    }

    const topNPerEntity = await queryData(`
      SELECT aggregation, identifier, count
      FROM (
        SELECT *, row_number() OVER (PARTITION BY aggregation ORDER BY count DESC) AS row_number
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation IN ('organizations', 'publishers', 'bureaus')
      )
      WHERE row_number <= ${AGGREGATION_COUNT}
      ORDER BY aggregation, count DESC;
    `);

    const organizations = topNPerEntity.filter((item) => item.aggregation === "organizations");
    const publishers = topNPerEntity.filter((item) => item.aggregation === "publishers");
    const bureaus = topNPerEntity.filter((item) => item.aggregation === "bureaus");

    return { organizations, publishers, bureaus };
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

  <main class="mt-8 flex flex-col gap-8 md:flex-row md:gap-12">
    <section
      class="md:sticky md:top-2 md:max-h-screen md:flex-2 md:self-start md:overflow-y-auto relative md:min-w-0"
      tabindex="-1"
    >
      <SkipLink href="#details" label="details view" />
      {#await topNFilters}
        <LoadingSpinner />
      {:then topNFilters}
        <FilterNav
          organizations={topNFilters.organizations}
          publishers={topNFilters.publishers}
          bureaus={topNFilters.bureaus}
        />
      {/await}
    </section>

    <section class="md:flex-3 relative md:min-w-0">
      <a id="details" class="sr-only" tabindex="-1" aria-label="Details"></a>
      <SkipLink href="#footer" label="bottom of page" />
      {#if $mainContentLoading}
        <LoadingSpinner />
      {/if}
      {@render children?.()}
    </section>
  </main>
</div>

<Footer />
