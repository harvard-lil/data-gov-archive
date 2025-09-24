<script>
  import { setContext } from "svelte";
  import { browser } from "$app/environment";
  import { SEARCH_CONTEXT_KEY } from "./search.js";
  import { PAGE_SIZE } from "$lib/config.js";

  const { children } = $props();

  // Create reactive state using $state rune (only available in .svelte files)
  let searchState = $state({
    isSearching: false,
    results: [],
    totalResults: 0,
    query: "",
    isSearchResults: false,
  });

  const performSearch = async (query, queryData) => {
    if (!query.trim() || !browser) return;

    searchState.isSearching = true;
    searchState.query = query.trim();
    searchState.isSearchResults = true;

    try {
      // Then get the actual results
      const results = await queryData(
        `
        SELECT *
        FROM read_parquet('datasets.parquet')
        WHERE
          lower(title) LIKE lower($1) OR
          lower(organization_title) LIKE lower($1) OR
          lower(notes) LIKE lower($1)
        ORDER BY name
        LIMIT ${PAGE_SIZE}
      `,
        [`%${query.trim()}%`]
      );

      searchState.results = results;
      searchState.totalResults = results.length;
      searchState.isSearching = false;
    } catch (error) {
      console.error("Search error:", error);
      searchState.isSearching = false;
      searchState.results = [];
      searchState.totalResults = 0;
    }
  };

  const clearSearch = () => {
    if (!browser) return;

    searchState.isSearching = false;
    searchState.results = [];
    searchState.totalResults = 0;
    searchState.query = "";
    searchState.isSearchResults = false;
  };

  const context = {
    get searchState() {
      return searchState;
    },
    performSearch,
    clearSearch,
  };

  setContext(SEARCH_CONTEXT_KEY, context);
</script>

{@render children?.()}
