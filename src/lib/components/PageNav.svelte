<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { PAGE_SIZE } from "$lib/config.js";

  let { pageNumber, totalItems, resource = null, pageSize = PAGE_SIZE } = $props();

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

<nav>
  <ul>
    <li>
      {#if pageNumber > 1}
        <a href={buildPageUrl(pageNumber - 1)}>Previous</a>
      {:else}
        <span>Previous</span>
      {/if}
    </li>
    <li>
      {#if pageNumber === 1 && totalPages === 1}
        Showing page {pageNumberLabel} of {totalPagesLabel}
      {:else if pageNumber < 2}
        Showing page {pageNumberLabel} of <a href={buildPageUrl(totalPages)}>{totalPagesLabel}</a>
      {:else if pageNumber < totalPages}
        Showing page <a href={buildPageUrl(1)}>{pageNumberLabel}</a> of
        <a href={buildPageUrl(totalPages)}>{totalPagesLabel}</a>
      {:else}
        Showing page <a href={buildPageUrl(1)}>{pageNumberLabel}</a> of
        {totalPagesLabel}
      {/if}
    </li>
    {#if pageNumber < totalPages}
      <li><a href={buildPageUrl(pageNumber + 1)}>Next</a></li>
    {:else}
      <span>Next</span>
    {/if}
  </ul>
</nav>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    display: flex;
    justify-content: space-between;

    li {
      display: inline-block;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  span {
    cursor: not-allowed;
  }

  nav:first-of-type {
    border-bottom: 1px dotted #222;
    padding-bottom: 0.5em;
    margin-bottom: 1.5em;
  }

  nav:last-of-type {
    border-top: 1px dotted #222;
    padding-top: 0.5em;
    margin-top: 1.5em;
  }
</style>
