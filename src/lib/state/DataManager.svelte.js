import {
  ensureSearchIndex,
  isSearchIndexReady,
  queryData,
  querySearchIndex,
} from "$lib/data/db.js";
import { browser } from "$app/environment";
import { entities } from "$lib/data/entities.js";
import { DATA_URL, PAGE_SIZE } from "$lib/data/config.js";
import { loadInitAggregations, loadInitDatasets } from "$lib/data/initData.js";
import { error } from "@sveltejs/kit";

// Full-text search
function buildFtsSearch(searchTerm, offset) {
  return {
    params: [searchTerm],
    countQuery: `
      SELECT count(*) AS count FROM (
        SELECT fts_main_search_docs.match_bm25(name, $1, conjunctive := 1) AS score
        FROM search_docs
      ) WHERE score IS NOT NULL
    `,
    resultsQuery: `
      SELECT name, title, notes, organization_title FROM (
        SELECT
          name,
          title,
          notes,
          organization_title,
          fts_main_search_docs.match_bm25(name, $1, conjunctive := 1) AS score
        FROM search_docs
      ) WHERE score IS NOT NULL
      ORDER BY score DESC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
  };
}

// Match substrings as a fallback option if FTS index is still loading
function buildLikeSearch(searchTerm, offset) {
  const where = `
    lower(title) LIKE lower($1) OR
    lower(organization_title) LIKE lower($1) OR
    lower(notes) LIKE lower($1) OR
    lower(publisher) LIKE lower($1) OR
    lower(bureau_name) LIKE lower($1)
  `;
  return {
    params: [`%${searchTerm}%`],
    countQuery: `
      SELECT count(*) AS count
      FROM '${DATA_URL}/datasets.parquet'
      WHERE ${where}
    `,
    resultsQuery: `
      SELECT name, title, notes, organization_title
      FROM '${DATA_URL}/datasets.parquet'
      WHERE ${where}
      ORDER BY name
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
  };
}

export function createDataManager() {
  // Data state
  const data = $state({
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

  // Load data for the current route parameters
  function update({ type = null, id = null, pageNumber = 1, searchQuery = null }) {
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

      loadSearchResults(searchQuery, currentPage, requestId);
      return;
    }

    // Store previous values for comparison
    const previousType = data.currentType;
    const previousId = data.currentId;

    // Update state immediately for non-search views
    data.currentType = currentType;
    data.currentId = currentId;
    data.pageNumber = currentPage;

    // Only show loading on initial load or when changing view type/ID
    const isViewChange = previousType !== currentType || previousId !== currentId;
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
      loadHomeData(currentPage, requestId);
      return;
    }

    // Debounce other data loading (entity lists, dataset details, etc.)
    loadingTimeout = setTimeout(async () => {
      // Check if this is still the latest request
      if (requestId !== currentRequestId) {
        return;
      }

      try {
        // Load data based on view type
        if (currentType === "dataset" && !currentId) {
          await loadDatasetsList(currentPage, requestId);
        } else if (currentType === "dataset" && currentId) {
          await loadDatasetDetail(currentId);
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
  }

  async function loadHomeData(page = 1, requestId) {
    try {
      const offset = (page - 1) * PAGE_SIZE;

      // Initial load: serve from JSON files
      if (offset === 0) {
        const [initDatasets, initAggregations] = await Promise.all([
          loadInitDatasets(),
          loadInitAggregations(),
        ]);

        if (requestId !== currentRequestId) {
          return;
        }

        data.datasets = initDatasets.slice(0, PAGE_SIZE);
        data.totalItems = initAggregations.datasetsCount;
        data.pageNumber = page;
        data.isLoading = false;
        data.isInitialLoad = false;
        return;
      }

      const datasetsCount = await queryData(`
        SELECT count
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = 'datasets'
      `);

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const datasets = await queryData(`
        SELECT name, title, notes, organization_title
        FROM '${DATA_URL}/datasets.parquet'
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
        FROM '${DATA_URL}/datasets.parquet'
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
        FROM '${DATA_URL}/datasets.parquet'
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
        SELECT
          datasets.name,
          title,
          notes,
          metadata_modified,
          organization_title,
          bureau_name,
          publisher,
          (
            SELECT array_agg(tag)
            FROM '${DATA_URL}/tags.parquet' AS tags
            WHERE tags.name = datasets.name
          ) AS tags
        FROM '${DATA_URL}/datasets.parquet'
        WHERE datasets.name = $1
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
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = '${entity.route}'
      `);

      // Check if this request is still current
      if (requestId !== currentRequestId) {
        return;
      }

      const instances = await queryData(`
        SELECT
          identifier,
          sum(count) AS count
        FROM '${DATA_URL}/aggregations.parquet'
        WHERE aggregation = '${entity.route}'
        GROUP BY identifier
        ORDER BY identifier
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
        FROM '${DATA_URL}/aggregations.parquet'
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
        FROM '${DATA_URL}/datasets.parquet'
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
      data.identifier = identifier;
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

      const offset = (page - 1) * PAGE_SIZE;

      // Use aggregations.parquet for count (much faster than JOIN)
      const datasetsCount = await queryData(
        `
        SELECT count
        FROM '${DATA_URL}/aggregations.parquet'
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
          organization_title
        FROM '${DATA_URL}/datasets.parquet' datasets
        INNER JOIN
          '${DATA_URL}/tags.parquet' tags ON datasets.name = tags.name
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
      data.identifier = tag;
      data.label = tag;
      data.entity = entity;
      data.isLoading = false;
      data.isInitialLoad = false;
    } catch (error) {
      console.error("Error loading tag datasets:", error);
      data.isLoading = false;
      data.isInitialLoad = false;
    }
  }

  async function loadSearchResults(query, page, requestId, allowUpgrade = true) {
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const searchTerm = query.trim();

      // Start building FTS index
      ensureSearchIndex().catch(() => {});

      // When index is ready, use it for search; if not, fall back to LIKE substring match
      const useFts = isSearchIndexReady();
      const { countQuery, resultsQuery, params } = useFts
        ? buildFtsSearch(searchTerm, offset)
        : buildLikeSearch(searchTerm, offset);
      const run = useFts ? querySearchIndex : queryData;

      // First get the total count
      const countResult = await run(countQuery, params);

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
      const datasets = await run(resultsQuery, params);

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

      // If we previously served LIKE fallback results, silently upgrade to BM25 results when ready
      if (!useFts && allowUpgrade) {
        ensureSearchIndex()
          .then(() => {
            if (requestId === currentRequestId) {
              loadSearchResults(query, page, requestId, false);
            }
          })
          .catch(() => {});
      }
    } catch (error) {
      console.error("Error loading search results:", error);
      data.isLoading = false;
    }
  }

  return { data, update };
}
