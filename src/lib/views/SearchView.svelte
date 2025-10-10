<script>
  import BreadcrumbNav from "$lib/components/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  let { data, resource, searchQuery, buildUrl } = $props();
</script>

<BreadcrumbNav
  {resource}
  {searchQuery}
  {buildUrl}
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  isLoading={data.isLoading}
/>

{#if data.isLoading}
  <p>Loading datasets…</p>
{:else if data.totalItems > 0}
  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} isTop={true} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
{:else if searchQuery}
  <p>0 results</p>
{/if}

<style lang="scss">
  h2 {
    font-weight: inherit;

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
</style>
