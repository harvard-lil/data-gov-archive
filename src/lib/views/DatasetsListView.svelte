<script>
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  export let data;
</script>

{#if data.isLoading}
  <p>Loading datasets…</p>
{:else if data.totalItems > 0}
  <h2><b>Datasets</b></h2>

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} resource="datasets" />

  <DatasetList datasets={data.datasets} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} resource="datasets" />
{:else}
  <p>No datasets found</p>
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
