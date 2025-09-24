import { getContext } from "svelte";
import { browser } from "$app/environment";

const SEARCH_CONTEXT_KEY = Symbol("search");

// Fallback context for SSR
const fallbackContext = {
  searchState: {
    isSearching: false,
    results: [],
    totalResults: 0,
    query: "",
    isSearchResults: false,
  },
  performSearch: async () => {},
  clearSearch: () => {},
};

export function getSearchContext() {
  const context = getContext(SEARCH_CONTEXT_KEY);
  return context || fallbackContext;
}

export { SEARCH_CONTEXT_KEY };
