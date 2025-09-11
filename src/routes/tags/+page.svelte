<script>
  import PageNav from "$lib/PageNav.svelte";
  import { browser } from "$app/environment";
  import TagList from "$lib/TagList.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";

  let data = $state({
    tags: [],
    totalItems: 0,
    pageNumber: 1,
  });

  // Load data when page changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    try {
      const url = new URL($page.url);
      const pageParam = url.searchParams.get("page");

      const pageNumber = pageParam ? parseInt(pageParam) : 1;
      const offset = (pageNumber - 1) * 500;

      const tagsCount = await queryData(`
        SELECT count(DISTINCT tag) AS count
        FROM parquet_scan('tags.parquet')
      `);

      const totalPages = Math.ceil(Number(tagsCount[0].count) / 500);

      if (pageNumber <= 0 || pageNumber > totalPages) {
        // Handle invalid page - could redirect or show error
        return;
      }

      const tags = await queryData(`
        SELECT tag
        FROM parquet_scan('tags.parquet')
        LIMIT 500 OFFSET ${offset}
      `);

      data.tags = tags.map((tag) => tag.tag);
      data.totalItems = Number(tagsCount[0].count);
      data.pageNumber = pageNumber;
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: Tags, page {data.pageNumber}</title>
</svelte:head>

<h2>Tags</h2>

{#if data.totalItems > 0}
  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} route="/tags" pageSize={500} />

  <TagList tags={data.tags} />

  <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} route="/tags" pageSize={500} />
{:else}
  <p>Loading tags...</p>
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
