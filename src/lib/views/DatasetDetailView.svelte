<script>
  import DatasetView from "$lib/components/DatasetView.svelte";

  export let data;
</script>

{#if data.dataset}
  <DatasetView dataset={data.dataset} />
{/if}
