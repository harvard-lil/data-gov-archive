<script>
  import DatasetDetail from "$lib/components/DatasetDetail.svelte";

  export let data;
</script>

{#if data.isLoading}
  <p>Loading dataset…</p>
{:else if data.dataset}
  <DatasetDetail dataset={data.dataset} />
{/if}
