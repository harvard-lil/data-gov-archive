<script>
  import { queryData } from "$lib/db.js";
  import { browser } from "$app/environment";
  import { performSearch, clearSearch, searchStore } from "$lib/searchStore.js";

  let searchQuery = $state("");
  let searchState = $state({ isSearching: false });

  // Subscribe to search store for loading state
  $effect(() => {
    const unsubscribe = searchStore.subscribe((store) => {
      searchState.isSearching = store.isSearching;
    });
    return unsubscribe;
  });

  const handleSearch = async () => {
    if (!searchQuery.trim() || !browser) return;
    await performSearch(searchQuery, queryData);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    searchQuery = "";
    clearSearch();
  };
</script>

<div class="search-container">
  <div class="search-box">
    <input
      type="text"
      bind:value={searchQuery}
      onkeypress={handleKeyPress}
      placeholder="Search datasets by title, organization, or notes..."
      disabled={searchState.isSearching}
    />
    <button onclick={handleSearch} disabled={searchState.isSearching || !searchQuery.trim()}>
      {searchState.isSearching ? "Searching..." : "Search"}
    </button>
    {#if searchQuery.trim()}
      <button onclick={handleClearSearch} class="clear-button">Clear</button>
    {/if}
  </div>
</div>

<style lang="scss">
  .search-container {
    margin: 1em 0 2em 0;
    padding: 1em;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  .search-box {
    display: flex;
    gap: 0.5em;
    margin-bottom: 1em;
    align-items: center;

    input {
      flex: 1;
      padding: 0.75em;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1em;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      &:disabled {
        background-color: #f8f9fa;
        cursor: not-allowed;
      }
    }

    button {
      padding: 0.75em 1.5em;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.2s;

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }
    }

    .clear-button {
      background-color: #6c757d;

      &:hover:not(:disabled) {
        background-color: #545b62;
      }
    }
  }
</style>
