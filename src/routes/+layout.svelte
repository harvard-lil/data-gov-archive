<script>
  import "../app.css";
  import { cleanup, ensureSearchIndex, instantiateDuckDB } from "$lib/data/db.js";
  import { loadInitAggregations } from "$lib/data/initData.js";
  import FilterNav from "$lib/components/navigation/FilterNav.svelte";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import SkipLink from "$lib/components/layout/SkipLink.svelte";
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  // Load sidebar filters on fast path (from JSON)
  let topNFilters = browser
    ? loadInitAggregations()
    : Promise.resolve({ organizations: [], publishers: [], bureaus: [] });

  const { children } = $props();

  // Warm up DuckDB and build the search index without blocking rendering
  if (browser) {
    instantiateDuckDB()
      .then(() => ensureSearchIndex())
      .catch(() => {});
  }

  // Clean up database connections when component is destroyed
  onDestroy(() => {
    cleanup();
  });
</script>

<div class="mx-auto my-0 min-h-screen max-w-225 p-6">
  <Header />

  <main class="mt-8 flex flex-col-reverse gap-8 md:flex-row md:gap-12">
    <section
      class="md:sticky md:top-2 md:max-h-screen md:flex-2 md:self-start md:overflow-y-auto relative md:min-w-0"
      tabindex="-1"
    >
      <SkipLink target="details" label="details view" />
      {#await topNFilters}
        <FilterNav loading />
      {:then topNFilters}
        <FilterNav
          organizations={topNFilters.organizations}
          publishers={topNFilters.publishers}
          bureaus={topNFilters.bureaus}
        />
      {/await}
    </section>

    <section class="md:flex-3 relative md:min-w-0">
      <a id="details" class="sr-only" tabindex="-1">Details</a>
      <SkipLink target="footer" label="bottom of page" />
      {@render children?.()}
    </section>
  </main>
</div>

<Footer />
