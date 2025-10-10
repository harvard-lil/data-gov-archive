<script>
  import BreadcrumbNav from "$lib/components/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  let { data, resource, buildUrl } = $props();
</script>

{#if data.entity && data.identifier}
  <BreadcrumbNav {resource} searchQuery={null} {buildUrl} pageNumber={data.pageNumber} />

  {#if data.isLoading}
    <p>Loading datasets…</p>
  {:else if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} isTop={true} />

    <DatasetList datasets={data.datasets} showOrganization={data.entity?.showOrganization} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
  {:else}
    <p>No datasets found.</p>
  {/if}
{/if}
