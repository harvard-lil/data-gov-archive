<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import { Search } from "lucide-svelte";

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
  <div class="align-center flex">
    <input
      id="search"
      class="rounded-l-sm flex-1 p-4 bg-inherit min-w-50 border-gray-800 border-1 border-r-0 border-dotted focus:border-1 focus:border-r-0 focus:border-solid focus:outline-2 focus:outline-gray-800/20 whitespace-nowrap overflow-hidden text-ellipsis placeholder:text-gray-800/50"
      type="text"
      maxLength="100"
      bind:value={searchQuery}
      onkeydown={handleKeyDown}
      placeholder="Search by dataset title, organization, publisher, bureau, description…"
    />
    <button
      class="flex-none text-lg px-8 cursor-pointer text-blue-700 border-blue-700 border-solid border-1 rounded-r-sm disabled:cursor-not-allowed disabled:border-gray-400 disabled:border-1 disabled:border-dotted disabled:bg-gray-200 disabled:text-gray-400 focus:outline-blue-700/20 focus:outline-2"
      title="Search"
      onclick={handleSearch}
      disabled={!searchQuery.trim() ||
        isLoading ||
        $page.url.searchParams.get("q") === searchQuery.trim()}
    >
      <Search size={24} strokeWidth={2} absoluteStrokeWidth />
    </button>
  </div>
</div>
