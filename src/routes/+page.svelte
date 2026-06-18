<script>
  import { error } from "@sveltejs/kit";
  import { createViewRouter } from "$lib/state/ViewRouter.svelte.js";
  import { createDataManager } from "$lib/state/DataManager.svelte.js";
  import HomeView from "$lib/views/HomeView.svelte";
  import SearchView from "$lib/views/SearchView.svelte";
  import DatasetsListView from "$lib/views/DatasetsListView.svelte";
  import DatasetDetailView from "$lib/views/DatasetDetailView.svelte";
  import EntityListView from "$lib/views/EntityListView.svelte";
  import EntityDetailView from "$lib/views/EntityDetailView.svelte";

  const router = createViewRouter();
  const dataManager = createDataManager();

  // Tag list has no view
  $effect(() => {
    if (router.type === "tag" && !router.id) {
      error(404, "Tag list not available");
    }
  });

  // Load data whenever the route parameters change
  $effect(() => {
    dataManager.update({
      type: router.type,
      id: router.id,
      pageNumber: router.pageNumber,
      searchQuery: router.searchQuery,
      view: router.view,
    });
  });

  // The view to render. Falls back to router.view only before the first load
  // commits a displayedView (initial paint / SSR); after that displayedView
  // always wins so the previous view stays put during fast navigations.
  let displayView = $derived(dataManager.data.displayedView ?? router.view);

  // Dynamic title
  let pageTitle = $derived.by(() => {
    let title = "Data.gov Archive Search";
    const data = dataManager.data;
    const currentView = displayView;

    if (currentView === "search" && data.label) {
      title += `: ${data.label}, page ${data.pageNumber}`;
    } else if (currentView === "entity-list" && data.entity) {
      title += `: ${data.entity.title}s`;
    } else if (currentView === "entity-detail" && data.label) {
      title += `: ${data.label}`;
    } else if (currentView === "dataset-detail" && data.dataset) {
      title += `: ${data.dataset.title}`;
    } else if (currentView === "datasets-list") {
      title += `: Datasets, page ${data.pageNumber}`;
    } else if (currentView === "entity-detail" && data.identifier) {
      title += `: ${data.identifier}`;
    }
    return title;
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<!-- Render the view that has loaded (displayedView lags router.view until the
     new view's data is ready or the skeleton threshold elapses) -->
{#if displayView === "search"}
  <SearchView
    data={dataManager.data}
    resource={router.resource}
    searchQuery={router.searchQuery}
    buildUrl={router.buildUrl}
  />
{:else if displayView === "home"}
  <HomeView data={dataManager.data} resource={router.resource} buildUrl={router.buildUrl} />
{:else if displayView === "datasets-list"}
  <DatasetsListView data={dataManager.data} buildUrl={router.buildUrl} />
{:else if displayView === "dataset-detail"}
  <DatasetDetailView
    data={dataManager.data}
    resource={router.resource}
    buildUrl={router.buildUrl}
  />
{:else if displayView === "entity-list"}
  <EntityListView data={dataManager.data} resource={router.resource} buildUrl={router.buildUrl} />
{:else if displayView === "entity-detail"}
  <EntityDetailView data={dataManager.data} resource={router.resource} buildUrl={router.buildUrl} />
{/if}
