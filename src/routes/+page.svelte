<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import DatasetView from "$lib/DatasetView.svelte";
  import EntityList from "$lib/EntityList.svelte";
  import PageNav from "$lib/PageNav.svelte";
  import { queryData } from "$lib/db.js";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { entities } from "$lib/entities.js";
  import { PAGE_SIZE } from "$lib/config.js";
  import { error } from "@sveltejs/kit";

  // Reactive query parameters
  const type = $derived($page.url.searchParams.get("type"));
  const id = $derived($page.url.searchParams.get("id"));
  const pageNumber = $derived(parseInt($page.url.searchParams.get("page") || "1"));
  const searchQuery = $derived($page.url.searchParams.get("q"));

  // Handle 404 for tag list (not supported)
  $effect(() => {
    if (type === "tag" && !id) {
      throw error(404, "Tag list not available");
    }
  });

  // Determine view based on type and search
  const view = $derived(() => {
    const currentType = type;
    const currentId = id;

    // If there's a search query, show search results
    if (searchQuery) {
      return "search";
    }

    if (!currentType) {
      return "home";
    }
    if (currentType === "dataset" && !currentId) return "datasets-list";
    if (currentType === "dataset" && currentId) return "dataset-detail";
    if (["organization", "bureau", "publisher"].includes(currentType) && !currentId)
      return "entity-list";
    if (["organization", "bureau", "publisher"].includes(currentType) && currentId)
      return "entity-detail";
    if (currentType === "tag" && currentId) return "entity-detail";
    return "home";
  });

  let data = $state({
    datasets: [],
    entities: [],
    entity: null,
    dataset: null,
    totalItems: 0,
    pageNumber: 1,
    currentType: null,
    currentId: null,
    identifier: "",
    label: "",
    isLoading: true,
    isInitialLoad: true,
  });

  // Debouncing state
  let loadingTimeout = null;
  let currentRequestId = 0;

  // Load data when parameters change
  $effect(async () => {
    if (!browser) return;

    const currentType = type;
    const currentId = id;
    const currentPage = pageNumber;

    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    // Generate unique request ID for this request
    const requestId = ++currentRequestId;

    // Handle search results (immediate, no debouncing)
    if (searchQuery) {
      // For search, clear previous data immediately to prevent flashing
      data.datasets = [];
      data.totalItems = 0;
      data.identifier = "";
      data.label = "";
      data.isLoading = true;
      data.currentType = currentType;
      data.currentId = currentId;
      data.pageNumber = currentPage;

      await loadSearchResults(searchQuery, currentPage, requestId);
      return;
    }

    // Update state immediately for non-search views
    data.currentType = currentType;
    data.currentId = currentId;
    data.pageNumber = currentPage;

    // Only show loading on initial load or when changing view type/ID
    const isViewChange = data.currentType !== currentType || data.currentId !== currentId;
    if (data.isInitialLoad || isViewChange) {
      data.isLoading = true;
      // Clear previous data when changing views to prevent showing wrong content
      if (isViewChange) {
        data.datasets = [];
        data.entities = [];
        data.entity = null;
        data.dataset = null;
        data.totalItems = 0;
        data.identifier = "";
        data.label = "";
      }
    }

    // Handle home page (immediate, no debouncing)
    if (!currentType) {
      await loadHomeData(currentPage, requestId);
      return;
    }

    // Debounce other data loading (entity lists, dataset details, etc.)
    loadingTimeout = setTimeout(async () => {
      // Check if this is still the latest request
      if (requestId !== currentRequestId) {
        return; // Ignore this request as it's outdated
      }

      try {
        // Load data based on view type
        if (currentType === "dataset" && !currentId) {
          await loadDatasetsList(currentPage, requestId);
        } else if (currentType === "dataset" && currentId) {
          await loadDatasetDetail(currentId, requestId);
        } else if (["organization", "bureau", "publisher"].includes(currentType) && !currentId) {
          await loadEntityList(currentType, currentPage, requestId);
        } else if (["organization", "bureau", "publisher"].includes(currentType) && currentId) {
          await loadEntityDetail(currentType, currentId, currentPage, requestId);
        } else if (currentType === "tag" && currentId) {
          await loadTagDatasets(currentId, currentPage, requestId);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        data.isLoading = false;
      }
    }, 150); // 150ms debounce delay
  });

  async function loadHomeData(page = 1, requestId) {
    try {
      const offset = (page - 1) * PAGE_SIZE;

      const datasetsCount = await queryData(`
        SELECT count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = 'datasets'
      `);

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const datasets = await queryData(`
        SELECT name, title, notes, organization_name, organization_title
        FROM read_parquet('datasets.parquet')
        ORDER BY name
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `);

      // Check again before updating state
      if (requestId !== currentRequestId) {
        return;
      }

      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0].count);
      data.pageNumber = page;
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading home data:", error);
      data.isLoading = false;
    }
  }

  async function loadDatasetsList(page, requestId) {
    try {
      const offset = (page - 1) * PAGE_SIZE;

      const datasetsCount = await queryData(`
        SELECT count(*) AS count
        FROM read_parquet('datasets.parquet')
      `);

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const totalPages = Math.ceil(Number(datasetsCount[0].count) / PAGE_SIZE);

      if (page <= 0 || page > totalPages) {
        data.isLoading = false;
        return;
      }

      const datasets = await queryData(`
        SELECT *
        FROM read_parquet('datasets.parquet')
        ORDER BY name
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `);

      // Check again before updating state
      if (requestId !== currentRequestId) {
        return;
      }

      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0].count);
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading datasets list:", error);
      data.isLoading = false;
    }
  }

  async function loadDatasetDetail(datasetName) {
    try {
      const datasets = await queryData(
        `
        SELECT *
        FROM read_parquet('datasets.parquet')
        WHERE name = $1
        LIMIT 1
      `,
        [datasetName]
      );

      data.dataset = datasets[0] || null;
      data.isLoading = false;
    } catch (error) {
      console.error("Error loading dataset detail:", error);
      data.isLoading = false;
    }
  }

  async function loadEntityList(entityType, page, requestId) {
    try {
      const entity = entities.find((e) => e.type === entityType);
      if (!entity) {
        error(404, `Entity not found: ${entityType}`);
        return;
      }

      const offset = (page - 1) * PAGE_SIZE;

      // Get total count first
      const totalCount = await queryData(`
        SELECT count(*) AS count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = '${entity.route}'
      `);

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const instances = await queryData(`
        SELECT
          identifier,
          label,
          sum(count) AS count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = '${entity.route}'
        GROUP BY identifier, label
        ORDER BY label
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `);

      // Check again before updating state
      if (requestId !== currentRequestId) {
        return;
      }

      data.entity = entity;
      data.entities = instances;
      data.totalItems = Number(totalCount[0].count);
      data.pageNumber = page;
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading entity list:", error);
      data.isLoading = false;
    }
  }

  async function loadEntityDetail(entityType, identifier, page, requestId) {
    try {
      const entity = entities.find((e) => e.type === entityType);
      if (!entity) {
        error(404, `Entity not found: ${entityType}`);
        return;
      }

      const offset = (page - 1) * PAGE_SIZE;

      // Get total count first
      const totalCount = await queryData(
        `
        SELECT count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = '${entity.route}' AND identifier = '${identifier}'
      `
      );

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

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

      // Check again before updating state
      if (requestId !== currentRequestId) {
        return;
      }

      data.datasets = datasets;
      data.totalItems = Number(totalCount[0]?.count || 0);
      data.pageNumber = page;
      data.identifier = encodeURIComponent(identifier);
      data.label = datasets[0]?.[entity.label] || identifier;
      data.entity = entity;
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading entity detail:", error);
      data.isLoading = false;
    }
  }

  async function loadTagDatasets(tag, page, requestId) {
    try {
      const entity = entities.find((e) => e.type === "tag");
      if (!entity) {
        error(404, `Entity not found: tag`);
        return;
      }

      // Set up entity data immediately to show proper loading state
      data.entity = entity;
      data.identifier = tag;
      data.label = tag;

      const offset = (page - 1) * PAGE_SIZE;

      // Use aggregations.parquet for count (much faster than JOIN)
      const datasetsCount = await queryData(
        `
        SELECT count
        FROM read_parquet('aggregations.parquet')
        WHERE aggregation = 'tags' AND identifier = $1
      `,
        [tag]
      );

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const totalPages = Math.ceil(Number(datasetsCount[0]?.count || 0) / PAGE_SIZE);

      if (page <= 0 || page > totalPages) {
        data.isLoading = false;
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
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `,
        [tag]
      );

      // Check again before updating state
      if (requestId !== currentRequestId) {
        return;
      }

      data.datasets = datasets;
      data.totalItems = Number(datasetsCount[0]?.count || 0);
      data.pageNumber = page;
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading tag datasets:", error);
      data.isLoading = false;
    }
  }

  async function loadSearchResults(query, page, requestId) {
    try {
      const offset = (page - 1) * PAGE_SIZE;

      // First get the total count
      const countResult = await queryData(
        `
          SELECT count(*) AS count
          FROM read_parquet('datasets.parquet')
          WHERE
            lower(title) LIKE lower($1) OR
            lower(organization_title) LIKE lower($1) OR
            lower(notes) LIKE lower($1)
        `,
        [`%${query.trim()}%`]
      );

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const totalPages = Math.ceil(Number(countResult[0]?.count || 0) / PAGE_SIZE);

      if (page <= 0 || page > totalPages) {
        data.isLoading = false;
        return;
      }

      // Then get the actual results
      const datasets = await queryData(
        `
          SELECT *
          FROM read_parquet('datasets.parquet')
          WHERE
            lower(title) LIKE lower($1) OR
            lower(organization_title) LIKE lower($1) OR
            lower(notes) LIKE lower($1)
          ORDER BY name
          LIMIT ${PAGE_SIZE} OFFSET ${offset}
        `,
        [`%${query.trim()}%`]
      );

      // Check again before updating state
      if (requestId !== currentRequestId) {
        return;
      }

      data.datasets = datasets;
      data.totalItems = Number(countResult[0]?.count || 0);
      data.pageNumber = page;
      data.identifier = query;
      data.label = `Search results for "${query}"`;
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading search results:", error);
      data.isLoading = false;
    }
  }

  // Helper function to build URLs
  function buildUrl(params = {}) {
    const url = new URL($page.url);
    url.search = "";
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, value.toString());
      }
    });
    return url.toString();
  }

  // Dynamic title
  let pageTitle = $state("Archive of Data.gov");

  $effect(() => {
    let title = "Archive of Data.gov";
    const currentView = view();
    if (currentView === "search" && data.label) {
      title += ` : ${data.label}, page ${data.pageNumber}`;
    } else if (currentView === "entity-list" && data.entity) {
      title += ` : ${data.entity.title}s`;
    } else if (currentView === "entity-detail" && data.label) {
      title += ` : ${data.label}`;
    } else if (currentView === "dataset-detail" && data.dataset) {
      title += ` : ${data.dataset.title}`;
    } else if (currentView === "datasets-list") {
      title += ` : Datasets, page ${data.pageNumber}`;
    } else if (currentView === "entity-detail" && data.identifier) {
      title += ` : ${data.identifier}`;
    }
    pageTitle = title;
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

{#if view() === "search"}
  {#if data.isLoading}
    <p>Searching…</p>
  {:else if data.totalItems > 0}
    <h2>
      <b>Search:</b>
      {data.identifier} ({data.totalItems.toLocaleString("en-US")} result{data.totalItems === 1
        ? ""
        : "s"})
    </h2>

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />

    <DatasetList datasets={data.datasets} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />
  {:else if data.identifier}
    <h2><b>Search:</b> {data.identifier} (0 results)</h2>
  {:else}
    <p>Searching…</p>
  {/if}
{:else if view() === "home"}
  {#if data.isLoading}
    <p>Loading datasets…</p>
  {:else if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />

    <DatasetList datasets={data.datasets} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} />
  {:else}
    <p>No datasets found</p>
  {/if}
{:else if view() === "datasets-list"}
  {#if data.isLoading}
    <p>Loading…</p>
  {:else if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} type="dataset" />

    <DatasetList datasets={data.datasets} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} type="dataset" />
  {:else}
    <p>Loading datasets…</p>
  {/if}
{:else if view() === "dataset-detail"}
  {#if data.isLoading}
    <p>Loading dataset…</p>
  {:else if data.dataset}
    <DatasetView dataset={data.dataset} />
  {:else}
    <p>Loading dataset…</p>
  {/if}
{:else if view() === "entity-list"}
  {#if data.isLoading}
    <p>Loading…</p>
  {:else if data.entity}
    <h2>{data.entity.title}s</h2>

    {#if data.totalItems > 0}
      <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} type={data.entity.type} />

      <EntityList entity={data.entity} instances={data.entities} />

      <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} type={data.entity.type} />
    {:else}
      <p>No {data.entity.title.toLowerCase()}s found.</p>
    {/if}
  {:else}
    <p>Loading…</p>
  {/if}
{:else if view() === "entity-detail"}
  {#if data.isLoading}
    <p>Loading…</p>
  {:else if data.entity && data.identifier}
    <h2>
      <b>{data.entity.title}:</b>
      {#if data.entity.type === "tag"}
        <span class="tag">
          {#if data.pageNumber > 1}
            <a href={buildUrl({ type: data.entity.type, id: data.identifier, page: 1 })}
              >{data.label}</a
            >
          {:else}
            {data.label}
          {/if}
        </span>
      {:else if data.pageNumber > 1}
        <a href={buildUrl({ type: data.entity.type, id: data.identifier, page: 1 })}>{data.label}</a
        >
      {:else}
        {data.label}
      {/if}
    </h2>

    {#if data.totalItems > 0}
      <PageNav
        pageNumber={data.pageNumber}
        totalItems={data.totalItems}
        type={data.entity.type}
        id={data.identifier}
      />

      <DatasetList datasets={data.datasets} showOrganization={data.entity?.showOrganization} />

      <PageNav
        pageNumber={data.pageNumber}
        totalItems={data.totalItems}
        type={data.entity.type}
        id={data.identifier}
      />
    {:else if data.entity.type === "tag"}
      <p>No datasets found for this tag.</p>
    {:else}
      <p>No datasets found.</p>
    {/if}
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
