<script>
  import DatasetView from "$lib/DatasetView.svelte";
  import { browser } from "$app/environment";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";

  let data = $state({
    dataset: null,
    tags: [],
  });

  // Load data when dataset name changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    try {
      const name = $page.params.name;

      const datasets = await queryData(
        `
        SELECT *
        FROM read_parquet('datasets.parquet')
        WHERE name = $1
        LIMIT 1
      `,
        [name]
      );

      data.dataset = datasets[0] || null;
    } catch (error) {
      console.error("Error loading dataset:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.dataset?.title || "Loading…"}</title>
</svelte:head>

{#if data.dataset}
  <DatasetView dataset={data.dataset} />
{:else}
  <p>Loading dataset…</p>
{/if}
