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
  }));

  try {
    // First get the total count
    const countResult = await queryData(
      `
      SELECT count(*) AS count
      FROM parquet_scan('datasets.parquet')
      WHERE
        LOWER(title) LIKE LOWER($1) OR
        LOWER(organization_title) LIKE LOWER($1)
    `,
      [`%${query.trim()}%`]
    );

    // Then get the actual results
    const results = await queryData(
      `
      SELECT *
      FROM parquet_scan('datasets.parquet')
      WHERE
        LOWER(title) LIKE LOWER($1) OR
        LOWER(organization_title) LIKE LOWER($1)
      ORDER BY name
      LIMIT 200
    `,
      [`%${query.trim()}%`]
    );

    const totalResults = Number(countResult[0].count);

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
