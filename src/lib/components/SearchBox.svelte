<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  let searchQuery = $state("");
  let isLoading = $state(false);

  // Initialize search query from URL
  $effect(() => {
    if (browser) {
      const urlQuery = $page.url.searchParams.get("q");
      searchQuery = urlQuery || "";
    }
  });

  const handleSearch = async () => {
    if (!searchQuery.trim() || !browser || isLoading) return;

    // Check if the search query is already the same as the current URL parameter
    const currentQuery = $page.url.searchParams.get("q");
    if (currentQuery === searchQuery.trim()) return;

    isLoading = true;

    try {
      // Navigate to search results with query parameter
      const url = new URL($page.url);
      url.search = "";
      url.searchParams.set("q", searchQuery.trim());
      url.searchParams.set("page", "1"); // Reset to first page
      await goto(url.toString());
    } finally {
      isLoading = false;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
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
    <button
      onclick={handleSearch}
      disabled={!searchQuery.trim() ||
        isLoading ||
        $page.url.searchParams.get("q") === searchQuery.trim()}
    >
      {#if isLoading}
        <LoadingSpinner />
      {:else}
        Search
      {/if}
    </button>
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
      font-family: "Public Sans Variable", sans-serif;
      background-color: inherit;
      color: #222;
      flex: 1;
      padding: 0.75em;
      border: 1px dotted #222;
      border-radius: 4px;
      font-size: 1em;

      &:disabled {
        cursor: not-allowed;
      }

      &::placeholder {
        color: #666;
      }

      &:focus {
        border: 1px solid #222;
        outline: 0.125em solid rgba(0, 0, 0, 0.125);
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
        color: #999;
        cursor: not-allowed;
      }
    }
  }
</style>
