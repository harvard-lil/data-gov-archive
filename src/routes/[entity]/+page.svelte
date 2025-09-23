<script>
  import { error } from "@sveltejs/kit";
  import EntityList from "$lib/EntityList.svelte";
  import { browser } from "$app/environment";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";
  import { entities } from "$lib/entities.js";

  let data = $state({
    entity: null,
    instances: [],
    totalItems: 0,
    pageNumber: 1,
  });

  // Load data when entity or page changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    const entityRoute = $page.params.entity;
    const url = new URL($page.url);
    const pageParam = url.searchParams.get("page");

    const pageNumber = pageParam ? parseInt(pageParam) : 1;

    // Check if params are available
    if (!entityRoute) {
      return;
    }

    const entity = entities.find((entity) => entity.route == entityRoute);
    if (!entity) {
      error(404, `Entity not found: ${entityRoute}`);
    }

    const offset = (pageNumber - 1) * 200;

    // Get total count first
    const totalCount = await queryData(`
        SELECT count(*) AS count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = '${entity.route}'
      `);

    const instances = await queryData(`
        SELECT
          identifier,
          label,
          sum(count) AS count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = '${entity.route}'
        GROUP BY identifier, label
        ORDER BY label
        LIMIT 200 OFFSET ${offset}
      `);

    data.entity = entity;
    data.instances = instances;
    data.totalItems = Number(totalCount[0].count);
    data.pageNumber = pageNumber;
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.entity?.title || "Loading…"}</title>
</svelte:head>

{#if data.entity}
  <h2>{data.entity.title}s</h2>

  {#if data.totalItems > 0}
    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/{data.entity.route}"
    />

    <EntityList entity={data.entity} instances={data.instances} />

    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/{data.entity.route}"
    />
  {:else}
    <p>Loading…</p>
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
  }
</style>
