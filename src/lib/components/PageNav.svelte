<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { PAGE_SIZE } from "$lib/config.js";

  let { pageNumber, totalItems, resource = null, pageSize = PAGE_SIZE, isTop = false } = $props();

  let offset = $derived((pageNumber - 1) * pageSize);
  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  let pageNumberLabel = $derived(pageNumber.toLocaleString("en-US"));
  let totalPagesLabel = $derived(totalPages.toLocaleString("en-US"));

  // Get current URL at top level
  const currentUrl = $page.url;

  // Helper function to build URL with query parameters
  function buildPageUrl(page) {
    const url = new URL(currentUrl);
    url.search = "";

    // Set page parameter
    url.searchParams.set("page", page.toString());

    // Add resource parameter if provided
    if (resource) {
      url.searchParams.set("resource", resource);
    }

    // Preserve search query if present
    const searchQuery = currentUrl.searchParams.get("q");
    if (searchQuery) {
      url.searchParams.set("q", searchQuery);
    }

    return url.toString();
  }
</script>

<nav class="mt-0 mb-0" class:mb-4={isTop} class:mt-4={!isTop} aria-label="Pagination">
  <ul class="flex justify-between">
    <li>
      {#if pageNumber > 1}
        <a class="text-inherit no-underline hover:underline" href={buildPageUrl(pageNumber - 1)}>
          Previous
        </a>
      {:else}
        <span class="cursor-not-allowed invisible" aria-hidden="true">Previous</span>
      {/if}
    </li>
    <li>
      {#if pageNumber === 1 && totalPages === 1}
        Showing page {pageNumberLabel} of {totalPagesLabel}
      {:else if pageNumber < 2}
        Showing page {pageNumberLabel} of
        <a class="text-inherit no-underline hover:underline" href={buildPageUrl(totalPages)}
          >{totalPagesLabel}</a
        >
      {:else if pageNumber < totalPages}
        Showing page <a class="text-inherit no-underline hover:underline" href={buildPageUrl(1)}
          >{pageNumberLabel}</a
        >
        of
        <a class="text-inherit no-underline hover:underline" href={buildPageUrl(totalPages)}
          >{totalPagesLabel}</a
        >
      {:else}
        Showing page <a class="text-inherit no-underline hover:underline" href={buildPageUrl(1)}
          >{pageNumberLabel}</a
        >
        of
        {totalPagesLabel}
      {/if}
    </li>
    {#if pageNumber < totalPages}
      <li>
        <a class="text-inherit no-underline hover:underline" href={buildPageUrl(pageNumber + 1)}>
          Next
        </a>
      </li>
    {:else}
      <span class="cursor-not-allowed invisible" aria-hidden="true">Next</span>
    {/if}
  </ul>
</nav>
