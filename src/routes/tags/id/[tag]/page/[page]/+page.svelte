<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";

  let data = $state({
    tag: "",
    datasets: [],
    totalItems: 0,
    pageNumber: 1,
  });

  // Load data when tag or page changes
  $effect(async () => {
    try {
      const tag = $page.params.tag;
      const pageNumber = parseInt($page.params.page);
      const offset = (pageNumber - 1) * 200;

      // Use aggregations.parquet for count (much faster than JOIN)
      const datasetsCount = await queryData(
        `
        SELECT count
        FROM parquet_scan('aggregations.parquet')
        WHERE aggregation = 'tags' AND identifier = $1
      `,
        [tag]
      );

      const totalPages = Math.ceil(Number(datasetsCount[0].count) / 200);

      if (pageNumber <= 0 || pageNumber > totalPages) {
        // Handle invalid page - could redirect or show error
        return;
      }

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
        OFFSET ${offset}
      `,
        [tag]
      );

      data.tag = tag;
      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0]?.count || 0);
      data.pageNumber = pageNumber;
    } catch (error) {
      console.error("Error loading tag page data:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.tag}, page {data.pageNumber}</title>
</svelte:head>

{#if data.tag}
  <h2>
    <b>Tag:</b>
    <span class="tag"><a href="/tags/id/{encodeURIComponent(data.tag)}">{data.tag}</a></span>
  </h2>

  {#if data.totalItems > 0}
    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/tags/id/{encodeURIComponent(data.tag)}"
    />

    <DatasetList datasets={data.datasets} />

    <PageNav
      pageNumber={data.pageNumber}
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

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

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
