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
    });
  });

  // Dynamic title
  let pageTitle = $derived.by(() => {
    let title = "Data.gov Archive Search";
    const currentView = router.view;
    const data = dataManager.data;

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

<!-- Render appropriate view based on current state -->
{#if router.view === "search"}
  <SearchView
    data={dataManager.data}
    resource={router.resource}
    searchQuery={router.searchQuery}
    buildUrl={router.buildUrl}
  />
{:else if router.view === "home"}
  <HomeView data={dataManager.data} resource={router.resource} buildUrl={router.buildUrl} />
{:else if router.view === "datasets-list"}
  <DatasetsListView data={dataManager.data} buildUrl={router.buildUrl} />
{:else if router.view === "dataset-detail"}
  <DatasetDetailView
    data={dataManager.data}
    resource={router.resource}
    buildUrl={router.buildUrl}
  />
{:else if router.view === "entity-list"}
  <EntityListView data={dataManager.data} resource={router.resource} buildUrl={router.buildUrl} />
{:else if router.view === "entity-detail"}
  <EntityDetailView data={dataManager.data} resource={router.resource} buildUrl={router.buildUrl} />
{/if}
