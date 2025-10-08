<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

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

<div class="text-xl">
  <div class="align-center flex gap-4">
    <input
      id="search"
      class="rounded-sm flex-1 p-4 bg-inherit border-slate-800 border-1 border-dotted focus:border-1 focus:border-solid focus:outline-2 focus:outline-slate-800/20 whitespace-nowrap overflow-hidden text-ellipsis placeholder:text-slate-800/50"
      type="text"
      maxLength="100"
      bind:value={searchQuery}
      onkeydown={handleKeyDown}
      placeholder="Search by dataset title, organization, publisher, bureau, description…"
    />
    <button
      class="flex-none text-sm md:text-lg px-4 md:px-8 cursor-pointer text-blue-700 border-blue-700 border-solid border-1 rounded-sm disabled:cursor-not-allowed disabled:border-slate-400 disabled:border-1 disabled:border-dotted disabled:bg-slate-200 disabled:text-slate-400 focus:outline-blue-700/20 focus:outline-2"
      onclick={handleSearch}
      disabled={!searchQuery.trim() ||
        isLoading ||
        $page.url.searchParams.get("q") === searchQuery.trim()}
    >
      Search
    </button>
  </div>
</div>
