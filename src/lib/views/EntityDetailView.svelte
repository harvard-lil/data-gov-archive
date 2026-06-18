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
  loading={data.isLoading}
/>

<div aria-busy={data.isLoading}>
  {#if data.isLoading || (data.entity && data.identifier && data.totalItems > 0)}
    <PageNav
      loading={data.isLoading}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
      isTop={true}
    />

    <DatasetList
      loading={data.isLoading}
      datasets={data.datasets}
      showOrganization={data.entity?.showOrganization}
    />

    <PageNav
      loading={data.isLoading}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
    />
  {:else if data.entity && data.identifier}
    <p>No datasets found.</p>
  {/if}
</div>
