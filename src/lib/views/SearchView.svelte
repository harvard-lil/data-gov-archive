<script>
  import BreadcrumbNav from "$lib/components/navigation/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/listing/DatasetList.svelte";
  import PageNav from "$lib/components/navigation/PageNav.svelte";

  let { data, resource, searchQuery, buildUrl } = $props();
</script>

<BreadcrumbNav
  {resource}
  {searchQuery}
  {buildUrl}
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  loading={data.showSkeleton}
/>

<div aria-busy={data.isLoading}>
  {#if data.showSkeleton || data.totalItems > 0}
    <PageNav
      loading={data.showSkeleton}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
      isTop={true}
    />

    <DatasetList loading={data.showSkeleton} datasets={data.datasets} />

    <PageNav
      loading={data.showSkeleton}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
    />
  {:else if searchQuery}
    <p>0 results</p>
  {/if}
</div>
