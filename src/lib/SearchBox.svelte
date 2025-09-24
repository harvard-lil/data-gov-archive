<script>
  import { queryData } from "$lib/db.js";
  import { browser } from "$app/environment";
  import { getSearchContext } from "$lib/search.js";

  let searchQuery = $state("");

  // Get search context
  const searchContext = getSearchContext();

  const handleSearch = async () => {
    if (!searchQuery.trim() || !browser) return;
    await searchContext.performSearch(searchQuery, queryData);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    searchQuery = "";
    searchContext.clearSearch();
  };
</script>

<div class="search-container">
  <div class="search-box">
    <input
      type="text"
      bind:value={searchQuery}
      onkeydown={handleKeyDown}
      placeholder="Search datasets by title, organization, or notes..."
      disabled={searchContext.searchState.isSearching}
    />
    <button
      onclick={handleSearch}
      disabled={searchContext.searchState.isSearching || !searchQuery.trim()}
    >
      {searchContext.searchState.isSearching ? "Searching..." : "Search"}
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
