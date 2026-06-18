<script>
  import BreadcrumbNav from "$lib/components/navigation/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/listing/DatasetList.svelte";
  import PageNav from "$lib/components/navigation/PageNav.svelte";

  let { data, buildUrl } = $props();
</script>

<BreadcrumbNav
  resource="datasets"
  searchQuery={null}
  {buildUrl}
  pageNumber={data.pageNumber}
  loading={data.isLoading}
/>

<div aria-busy={data.isLoading}>
  {#if data.isLoading || data.totalItems > 0}
    <PageNav
      loading={data.isLoading}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      resource="datasets"
      isTop={true}
    />

    <DatasetList loading={data.isLoading} datasets={data.datasets} />

    <PageNav
      loading={data.isLoading}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      resource="datasets"
    />
  {:else}
    <p>No datasets found</p>
  {/if}
</div>
