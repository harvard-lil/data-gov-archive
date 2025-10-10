<script>
  import BreadcrumbNav from "$lib/components/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  let { data, buildUrl } = $props();
</script>

<BreadcrumbNav resource="datasets" searchQuery={null} {buildUrl} pageNumber={data.pageNumber} />

{#if data.isLoading}
  <p>Loading datasets…</p>
{:else if data.totalItems > 0}
  <PageNav
    pageNumber={data.pageNumber}
    totalItems={data.totalItems}
    resource="datasets"
    isTop={true}
  />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} resource="datasets" />
{:else}
  <p>No datasets found</p>
{/if}
