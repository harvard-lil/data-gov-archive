<script>
  import { resolve } from "$app/paths";
  import { page } from "$app/stores";
  import { PAGE_SIZE } from "$lib/config.js";

  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  let { pageNumber, totalItems, resource = null, pageSize = PAGE_SIZE, isTop = false } = $props();

  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  let pageNumberLabel = $derived(pageNumber.toLocaleString("en-US"));
  let totalPagesLabel = $derived(totalPages.toLocaleString("en-US"));

  // Build a base-relative path with query parameters. Callers wrap this in
  // resolve() so the configured base path is applied (see $app/paths).
  function buildPageUrl(targetPage) {
    const entries = [];

    // Add resource parameter if provided
    if (resource) {
      entries.push(["resource", resource]);
    }

    // Preserve search query if present
    const searchQuery = $page.url.searchParams.get("q");
    if (searchQuery) {
      entries.push(["q", searchQuery]);
    }

    // Set page parameter
    entries.push(["page", targetPage.toString()]);

    const query = entries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return `/?${query}`;
  }
</script>

<nav class="mt-0 mb-0" class:mb-4={isTop} class:mt-4={!isTop} aria-label="Pagination">
  <ul class="flex justify-between">
    <li>
      {#if pageNumber > 1}
        <a
          class="text-inherit no-underline hover:underline"
          href={resolve(buildPageUrl(pageNumber - 1))}
        >
          <ChevronLeft class="inline-block" size={16} strokeWidth={1} absoluteStrokeWidth />
          Previous
        </a>
      {:else}
        <span class="cursor-not-allowed invisible" aria-hidden="true">
          <ChevronLeft class="inline-block" size={16} strokeWidth={1} absoluteStrokeWidth />
          Previous
        </span>
      {/if}
    </li>
    <li>
      {#if pageNumber === 1 && totalPages === 1}
        Showing page {pageNumberLabel} of {totalPagesLabel}
      {:else if pageNumber < 2}
        Showing page {pageNumberLabel} of
        <a
          class="text-inherit no-underline hover:underline"
          href={resolve(buildPageUrl(totalPages))}>{totalPagesLabel}</a
        >
      {:else if pageNumber < totalPages}
        Showing page <a
          class="text-inherit no-underline hover:underline"
          href={resolve(buildPageUrl(1))}>{pageNumberLabel}</a
        >
        of
        <a
          class="text-inherit no-underline hover:underline"
          href={resolve(buildPageUrl(totalPages))}>{totalPagesLabel}</a
        >
      {:else}
        Showing page <a
          class="text-inherit no-underline hover:underline"
          href={resolve(buildPageUrl(1))}>{pageNumberLabel}</a
        >
        of
        {totalPagesLabel}
      {/if}
    </li>
    {#if pageNumber < totalPages}
      <li>
        <a
          class="text-inherit no-underline hover:underline"
          href={resolve(buildPageUrl(pageNumber + 1))}
        >
          Next
          <ChevronRight class="inline-block" size={16} strokeWidth={1} absoluteStrokeWidth />
        </a>
      </li>
    {:else}
      <span class="cursor-not-allowed invisible" aria-hidden="true">
        Next
        <ChevronRight class="inline-block" size={16} strokeWidth={1} absoluteStrokeWidth />
      </span>
    {/if}
  </ul>
</nav>
