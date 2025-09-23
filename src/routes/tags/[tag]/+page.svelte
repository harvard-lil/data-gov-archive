<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  let data = $state({
    datasets: [],
    totalItems: 0,
    pageNumber: 1,
    tag: "",
    isLoading: true,
  });

  // Load data when tag or page changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    data.isLoading = true;

    try {
      const tag = $page.params.tag;
      const url = new URL($page.url);
      const pageParam = url.searchParams.get("page");
      const pageNumber = pageParam ? parseInt(pageParam) : 1;
      const offset = (pageNumber - 1) * 200;

      // Use aggregations.parquet for count (much faster than JOIN)
      const datasetsCount = await queryData(
        `
        SELECT count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = 'tags' AND identifier = $1
      `,
        [tag]
      );

      const totalPages = Math.ceil(Number(datasetsCount[0]?.count || 0) / 200);

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
        FROM read_parquet('datasets.parquet') datasets
        INNER JOIN read_parquet('tags.parquet') tags ON datasets.name = tags.name
        WHERE tags.tag = $1
        ORDER BY datasets.name
        LIMIT 200 OFFSET ${offset}
      `,
        [tag]
      );

      data.tag = tag;
      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0]?.count || 0);
      data.pageNumber = pageNumber;
    } catch (error) {
      console.error("Error loading tag page data:", error);
    } finally {
      data.isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.tag || "Loading…"}</title>
</svelte:head>

{#if data.isLoading}
  <p>Loading…</p>
{:else if data.tag}
  <h2>
    <b>Tag:</b>
    <span class="tag">
      {#if data.pageNumber > 1}
        <a href="?page=1">{data.tag}</a>
      {:else}
        {data.tag}
      {/if}
    </span>
  </h2>

  {#if data.totalItems > 0}
    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/tags/{encodeURIComponent(data.tag)}"
    />

    <DatasetList datasets={data.datasets} />

    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/tags/{encodeURIComponent(data.tag)}"
    />
  {:else}
    <p>No datasets found for this tag.</p>
  {/if}
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
