<script>
  import { page } from "$app/stores";
  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { entities } from "$lib/entities.js";

  let data = $state({
    entity: null,
    datasets: [],
    totalItems: 0,
    pageNumber: 1,
    identifier: "",
    label: "",
  });

  // Load data when entity, identifier, or page changes
  $effect(async () => {
    try {
      const entityRoute = $page.params.entity;
      const identifier = $page.params.identifier;
      const pageNumber = parseInt($page.params.page);
      const offset = (pageNumber - 1) * 200;

      const entity = entities.find((entity) => entity.route == entityRoute);
      if (!entity) {
        // Handle invalid entity - could redirect or show error
        return;
      }

      // Get total count first
      const totalCount = await queryData(
        `
        SELECT count(*) AS count
        FROM parquet_scan('datasets.parquet')
        WHERE ${entity.identifier} = $1
      `,
        [identifier]
      );

      const datasets = await queryData(
        `
        SELECT *
        FROM parquet_scan('datasets.parquet')
        WHERE ${entity.identifier} = $1
        ORDER BY name
        LIMIT 200
        OFFSET ${offset}
      `,
        [identifier]
      );

      data.entity = entity;
      data.datasets = datasets;
      data.totalItems = Number(totalCount[0].count);
      data.pageNumber = pageNumber;
      data.identifier = encodeURIComponent(identifier);
      data.label = datasets[0]?.[entity.label] || identifier;
    } catch (error) {
      console.error("Error loading entity datasets:", error);
    }
  });
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.label || "Loading..."}</title>
</svelte:head>

{#if data.entity}
  <h2>
    <b>{data.entity.title}:</b>
    {#if data.pageNumber > 1}
      <a href="./1">{data.label}</a>
    {:else}
      {data.label}
    {/if}
  </h2>

  {#if data.totalItems > 0}
    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/{data.entity.route}/id/{data.identifier}"
    />

    <DatasetList
      datasets={data.datasets}
      showOrganization={!(data.entity.route === "organizations")}
    />

    <PageNav
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      route="/{data.entity.route}/id/{data.identifier}"
    />
  {:else}
    <p>Loading datasets for {data.entity.title.toLowerCase()}...</p>
  {/if}
{:else}
  <p>Loading...</p>
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
