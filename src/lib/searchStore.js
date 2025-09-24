import { writable } from "svelte/store";

export const searchStore = writable({
  isSearching: false,
  results: [],
  totalResults: 0,
  query: "",
  isSearchResults: false,
});

export const performSearch = async (query, queryData) => {
  if (!query.trim()) return;

  searchStore.update((store) => ({
    ...store,
    isSearching: true,
    query: query.trim(),
    isSearchResults: true, // Set this to true when search starts to show loading state
  }));

  try {
    // Then get the actual results
    const results = await queryData(
      `
      SELECT *
      FROM read_parquet('datasets.parquet')
      WHERE
        lower(title) LIKE lower($1) OR
        lower(organization_title) LIKE lower($1)
      ORDER BY name
      LIMIT 200
    `,
      [`%${query.trim()}%`]
    );

    const totalResults = results.length;

    searchStore.update((store) => ({
      ...store,
      isSearching: false,
      results,
      totalResults,
      isSearchResults: true,
    }));
  } catch (error) {
    console.error("Search error:", error);
    searchStore.update((store) => ({
      ...store,
      isSearching: false,
      results: [],
      totalResults: 0,
      isSearchResults: true,
    }));
  }
};

export const clearSearch = () => {
  searchStore.update((store) => ({
    ...store,
    isSearching: false,
    results: [],
    totalResults: 0,
    query: "",
    isSearchResults: false,
  }));
};
