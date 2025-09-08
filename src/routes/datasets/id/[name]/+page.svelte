<script>
  import DatasetView from "$lib/DatasetView.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";

  let data = $state({
    dataset: null,
    tags: [],
  });

  // Load data when dataset name changes
  $effect(async () => {
    try {
      const name = $page.params.name;

      const datasets = await queryData(
        `
        SELECT *
        FROM parquet_scan('datasets.parquet')
        WHERE name = $1
        LIMIT 1
      `,
        [name]
      );

      const tags = await queryData(
        `
        SELECT tag
        FROM parquet_scan('tags.parquet')
        WHERE name = $1
        ORDER BY tag
      `,
        [name]
      );

      data.dataset = datasets[0] || null;
      data.tags = tags.map((tag) => tag.tag);
    } catch (error) {
      console.error("Error loading dataset:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.dataset?.title || "Loading..."}</title>
</svelte:head>

{#if data.dataset}
  <DatasetView dataset={data.dataset} tags={data.tags} />
{:else}
  <p>Loading dataset...</p>
{/if}
