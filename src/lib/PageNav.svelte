<script>
  let {
    pageNumber,
    totalItems,
    route = "/datasets",
    pageSize = 200,
    additionalParams = "",
  } = $props();

  let offset = $derived((pageNumber - 1) * pageSize);
  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  let pageNumberLabel = $derived(pageNumber.toLocaleString("en-US"));
  let totalPagesLabel = $derived(totalPages.toLocaleString("en-US"));

  // Helper function to build URL with page parameter
  function buildPageUrl(page) {
    const baseUrl = route;
    const params = new URLSearchParams();
    params.set("page", page.toString());

    // Add any additional parameters
    if (additionalParams) {
      const additional = new URLSearchParams(additionalParams);
      for (const [key, value] of additional) {
        params.set(key, value);
      }
    }

    return `${baseUrl}?${params.toString()}`;
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
</style>
