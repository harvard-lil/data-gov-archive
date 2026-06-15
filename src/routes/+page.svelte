<script>
  import ViewRouter from "$lib/ViewRouter.svelte";
  import DataManager from "$lib/DataManager.svelte";
  import HomeView from "$lib/views/HomeView.svelte";
  import SearchView from "$lib/views/SearchView.svelte";
  import DatasetsListView from "$lib/views/DatasetsListView.svelte";
  import DatasetDetailView from "$lib/views/DatasetDetailView.svelte";
  import EntityListView from "$lib/views/EntityListView.svelte";
  import EntityDetailView from "$lib/views/EntityDetailView.svelte";
  import { mainContentLoading } from "$lib/loadingStore.js";

  // Create instances of the router and data manager
  let viewRouter = $state();
  let dataManager = $state();

  // Dynamic title
  let pageTitle = $state("Data.gov Archive Search");

  // Update main content loading state based on DataManager
  $effect(() => {
    if (dataManager) {
      mainContentLoading.set(dataManager.data.isLoading);
    }
  });

  $effect(() => {
    if (!viewRouter || !dataManager) return;

    let title = "Data.gov Archive Search";
    const currentView = viewRouter.view();
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
    pageTitle = title;
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<!-- View Router and Data Manager -->
<ViewRouter bind:this={viewRouter} />
<DataManager
  bind:this={dataManager}
  type={viewRouter?.type}
  id={viewRouter?.id}
  pageNumber={viewRouter?.pageNumber}
  searchQuery={viewRouter?.searchQuery}
/>

<!-- Render appropriate view based on current state -->
{#if viewRouter && dataManager}
  {#if viewRouter.view() === "search"}
    <SearchView
      data={dataManager.data}
      resource={viewRouter.resource}
      searchQuery={viewRouter.searchQuery}
      buildUrl={viewRouter.buildUrl}
    />
  {:else if viewRouter.view() === "home"}
    <HomeView
      data={dataManager.data}
      resource={viewRouter.resource}
      buildUrl={viewRouter.buildUrl}
    />
  {:else if viewRouter.view() === "datasets-list"}
    <DatasetsListView data={dataManager.data} buildUrl={viewRouter.buildUrl} />
  {:else if viewRouter.view() === "dataset-detail"}
    <DatasetDetailView data={dataManager.data} buildUrl={viewRouter.buildUrl} />
  {:else if viewRouter.view() === "entity-list"}
    <EntityListView
      data={dataManager.data}
      resource={viewRouter.resource}
      buildUrl={viewRouter.buildUrl}
    />
  {:else if viewRouter.view() === "entity-detail"}
    <EntityDetailView
      data={dataManager.data}
      resource={viewRouter.resource}
      buildUrl={viewRouter.buildUrl}
    />
  {/if}
{/if}
