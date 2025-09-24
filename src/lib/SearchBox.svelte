<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let searchQuery = $state("");

  // Initialize search query from URL
  $effect(() => {
    if (browser) {
      const urlQuery = $page.url.searchParams.get("q");
      searchQuery = urlQuery || "";
    }
  });

  const handleSearch = () => {
    if (!searchQuery.trim() || !browser) return;

    // Navigate to search results with query parameter
    const url = new URL($page.url);
    url.search = "";
    url.searchParams.set("q", searchQuery.trim());
    url.searchParams.set("page", "1"); // Reset to first page
    goto(url.toString());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    searchQuery = "";
    // Navigate back to home page
    const url = new URL($page.url);
    url.search = "";
    goto(url.toString());
  };
</script>

<div class="search-container">
  <div class="search-box">
    <input
      type="text"
      bind:value={searchQuery}
      onkeydown={handleKeyDown}
      placeholder="Search datasets by title, organization, or notes..."
    />
    <button onclick={handleSearch} disabled={!searchQuery.trim()}> Search </button>
    {#if searchQuery.trim()}
      <button onclick={handleClearSearch} class="clear-button">Clear</button>
    {/if}
  </div>
</div>

<style lang="scss">
  .search-container {
    margin: 1.5em 0 0.5em;
    padding: 0;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 1.25em;
  }

  .search-box {
    display: flex;
    gap: 0.5em;
    align-items: center;

    input {
      background-color: #ccc;
      flex: 1;
      padding: 0.75em;
      border: 1px solid #222;
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
      background-color: rgb(0, 0, 238);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.2s;

      &:hover:not(:disabled) {
        background-color: rgb(0, 0, 238);
      }

      &:disabled {
        background-color: #444;
        color: #ccc;
        cursor: not-allowed;
      }
    }

    .clear-button {
      background-color: #444;

      &:hover:not(:disabled) {
        background-color: #444;
      }
    }
  }
</style>
