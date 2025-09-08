<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";

  let data = $state({
    tag: "",
    datasets: [],
    totalItems: 0,
  });

  // Load data when tag changes
  $effect(async () => {
    try {
      const tag = $page.params.tag;

      const datasetsCount = await queryData(
        `
        SELECT count(*) AS count
        FROM parquet_scan('datasets.parquet') datasets
        INNER JOIN parquet_scan('tags.parquet') tags ON datasets.name = tags.name
        WHERE tags.tag = $1
      `,
        [tag]
      );

      const datasets = await queryData(
        `
        SELECT
          datasets.name,
          title,
          notes,
          organization_name,
          organization_title
        FROM parquet_scan('datasets.parquet') datasets
        INNER JOIN parquet_scan('tags.parquet') tags ON datasets.name = tags.name
        WHERE tags.tag = $1
        ORDER BY datasets.name
        LIMIT 200
      `,
        [tag]
      );

      data.tag = tag;
      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0].count);
    } catch (error) {
      console.error("Error loading tag data:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.tag}</title>
</svelte:head>

{#if data.tag}
  <h2><b>Tag:</b> <span class="tag">{data.tag}</span></h2>

  {#if data.totalItems > 0}
    <PageNav
      pageNumber={1}
      totalItems={data.totalItems}
      route="/tags/id/{encodeURIComponent(data.tag)}"
    />

    <DatasetList datasets={data.datasets} />

    <PageNav
      pageNumber={1}
      totalItems={data.totalItems}
      route="/tags/id/{encodeURIComponent(data.tag)}"
    />
  {:else}
    <p>Loading datasets for tag "{data.tag}"...</p>
  {/if}
{:else}
  <p>Loading tag...</p>
{/if}

<style lang="scss">
  h2 {
    font-weight: inherit;

    span.tag {
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted #222;
      margin-left: 0.25em;
      padding: 0.5em 0.75em;

      font-family: monospace;
      font-weight: 400;
    }
  }
</style>
