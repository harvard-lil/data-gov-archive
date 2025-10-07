<script>
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  export let data;
  export let resource;
  export let searchQuery;
</script>

{#if data.isLoading}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
{:else if data.totalItems > 0}
  <h2>
    <b>Search:</b>
    {data.identifier} ({data.totalItems.toLocaleString("en-US")} result{data.totalItems === 1
      ? ""
      : "s"})
  </h2>

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
{:else if searchQuery}
  <h2><b>Search:</b> {searchQuery} (0 results)</h2>
{:else}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
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
