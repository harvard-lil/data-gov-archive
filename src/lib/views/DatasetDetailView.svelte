<script>
  import DatasetView from "$lib/components/DatasetView.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  export let data;
</script>

{#if data.isLoading}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
{:else if data.dataset}
  <DatasetView dataset={data.dataset} />
{:else}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
{/if}
