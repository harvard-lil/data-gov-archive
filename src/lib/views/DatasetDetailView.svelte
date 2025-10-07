<script>
  import DatasetView from "$lib/components/DatasetView.svelte";

  export let data;
</script>

{#if data.isLoading}
  <p>Loading dataset…</p>
{:else if data.dataset}
  <DatasetView dataset={data.dataset} />
{/if}
