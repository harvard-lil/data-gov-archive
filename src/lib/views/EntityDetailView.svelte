<script>
  import BreadcrumbNav from "$lib/components/navigation/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/listing/DatasetList.svelte";
  import PageNav from "$lib/components/navigation/PageNav.svelte";

  let { data, resource, buildUrl } = $props();
</script>

<BreadcrumbNav
  {resource}
  searchQuery={null}
  {buildUrl}
  pageNumber={data.pageNumber}
  loading={data.showSkeleton}
/>

<div aria-busy={data.isLoading}>
  {#if data.showSkeleton || (data.entity && data.identifier && data.totalItems > 0)}
    <PageNav
      loading={data.showSkeleton}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
      isTop={true}
    />

    <DatasetList
      loading={data.showSkeleton}
      datasets={data.datasets}
      showOrganization={data.entity?.showOrganization}
    />

    <PageNav
      loading={data.showSkeleton}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
    />
  {:else if data.entity && data.identifier}
    <p>No datasets found.</p>
  {/if}
</div>
