<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  import { Search } from "@lucide/svelte";

  let searchQuery = $state("");
  let isLoading = $state(false);
  let currentQuery = $derived(browser ? page.url.searchParams.get("q") : null);

  // Initialize search query from URL
  $effect(() => {
    if (browser) {
      searchQuery = currentQuery || "";
    }
  });

  const handleSearch = async () => {
    if (!searchQuery.trim() || !browser || isLoading) return;

    // Check if the search query is already the same as the current URL parameter
    if (currentQuery === searchQuery.trim()) return;

    isLoading = true;

    try {
      // Navigate to search results with query parameter (page reset to 1)
      const query = `q=${encodeURIComponent(searchQuery.trim())}&page=1`;
      await goto(resolve(`/?${query}`));
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

<div class="text-xl">
  <div class="align-center flex">
    <input
      id="search"
      class="rounded-l-sm flex-1 p-4 bg-inherit min-w-50 border-slate-800 border border-r-0 border-dotted focus:border focus:border-r-0 focus:border-solid focus:outline-2 focus:outline-slate-800/20 whitespace-nowrap overflow-hidden text-ellipsis placeholder:text-slate-800/50"
      type="text"
      maxLength="100"
      bind:value={searchQuery}
      onkeydown={handleKeyDown}
      placeholder="Search datasets…"
    />
    <button
      class="flex-none text-lg px-8 cursor-pointer text-blue-700 border-blue-700 border-solid border rounded-r-sm disabled:cursor-not-allowed disabled:border-slate-400 disabled:border disabled:border-dotted disabled:bg-slate-200 disabled:text-slate-400 focus:outline-blue-700/20 focus:outline-2"
      title="Search"
      onclick={handleSearch}
      disabled={!searchQuery.trim() || isLoading || currentQuery === searchQuery.trim()}
    >
      <Search size={24} strokeWidth={2} absoluteStrokeWidth />
    </button>
  </div>
</div>
