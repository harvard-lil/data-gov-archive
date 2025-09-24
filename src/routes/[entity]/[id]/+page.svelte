<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { error } from "@sveltejs/kit";
  import { entities } from "$lib/entities.js";
  import { PAGE_SIZE } from "$lib/config.js";

  let data = $state({
    datasets: [],
    totalItems: 0,
    pageNumber: 1,
    identifier: "",
    label: "",
    entity: null,
  });

  // Load data when entity, identifier or page changes
  $effect(async () => {
    // Only run queries in the browser
    if (!browser) return;

    try {
      const entityRoute = $page.params.entity;
      const identifier = $page.params.id;
      const url = new URL($page.url);
      const pageParam = url.searchParams.get("page");
      const pageNumber = pageParam ? parseInt(pageParam) : 1;
      const offset = (pageNumber - 1) * PAGE_SIZE;

      // Find the entity configuration
      const entity = entities.find((entity) => entity.route === entityRoute);
      if (!entity) {
        error(404, `Entity not found: ${entityRoute}`);
      }

      // Get total count first
      const totalCount = await queryData(
        `
        SELECT count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = '${entity.route}' AND identifier = '${identifier}'
      `
      );

      const datasets = await queryData(
        `
        SELECT *
        FROM read_parquet('datasets.parquet')
        WHERE ${entity.identifier} = $1
        ORDER BY name
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `,
        [identifier]
      );

      data.datasets = datasets;
      data.totalItems = Number(totalCount[0]?.count || 0);
      data.pageNumber = pageNumber;
      data.identifier = encodeURIComponent(identifier);
      data.label = datasets[0]?.[entity.label] || identifier;
      data.entity = entity;
    } catch (error) {
      error(500, `Error loading ${entityRoute} datasets`);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.label || "Loading…"}</title>
</svelte:head>

{#if data.entity}
  <h2>
    <b>{data.entity.title}:</b>
    {#if data.pageNumber > 1}
      <a href="?page=1">{data.label}</a>
    {:else}
      {data.label}
    {/if}
  </h2>
{/if}

{#if data.totalItems > 0}
  <PageNav
    pageNumber={data.pageNumber}
    totalItems={data.totalItems}
    route="/{data.entity?.route}/{data.identifier}"
  />

  <DatasetList datasets={data.datasets} showOrganization={data.entity?.showOrganization} />

  <PageNav
    pageNumber={data.pageNumber}
    totalItems={data.totalItems}
    route="/{data.entity?.route}/{data.identifier}"
  />
{:else}
  <p>Loading datasets…</p>
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
