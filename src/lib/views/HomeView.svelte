<script>
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  export let data;
  export let resource;
</script>

{#if data.isLoading}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
{:else if data.totalItems > 0}
  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
{:else}
  <p>No datasets found</p>
{/if}
