<script>
  import EntityList from "$lib/EntityList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { page } from "$app/stores";
  import { entities } from "$lib/entities.js";

  let data = $state({
    entity: null,
    instances: [],
    pageNumber: 1,
  });

  // Load data when entity or page changes
  $effect(async () => {
    try {
      const entityRoute = $page.params.entity;
      const pageNumber = parseInt($page.params.page);

      // Check if params are available
      if (!entityRoute || !pageNumber) {
        return;
      }

      const offset = (pageNumber - 1) * 200;

      const entity = entities.find((entity) => entity.route == entityRoute);
      if (!entity) {
        console.error("Entity not found:", entityRoute);
        return;
      }

      const instances = await queryData(`
        SELECT
          ${entity.identifier},
          ${entity.label},
          count(*) AS count,
          max(metadata_modified) AS last_modified
        FROM parquet_scan('datasets.parquet')
        WHERE ${entity.identifier} IS NOT NULL
        GROUP BY ${entity.identifier}, ${entity.label}
        ORDER BY ${entity.identifier}
        LIMIT 200
        OFFSET ${offset}
      `);

      data.entity = entity;
      data.instances = instances;
      data.pageNumber = pageNumber;
    } catch (error) {
      console.error("Error loading entity data:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.entity?.title || "Loading..."}</title>
</svelte:head>

{#if data.entity}
  <h2>{data.entity.title}s</h2>

  {#if data.instances.length > 0}
    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.instances.length}
      route="/{data.entity.route}"
    />

    <EntityList entity={data.entity} instances={data.instances} />

    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.instances.length}
      route="/{data.entity.route}"
    />
  {:else}
    <p>Loading {data.entity.title.toLowerCase()}...</p>
  {/if}
{:else}
  <p>Loading...</p>
{/if}
