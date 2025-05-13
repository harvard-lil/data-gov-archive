<script>
  let { pageNumber, totalItems, route = "datasets", pageSize = 200 } = $props();

  let offset = $derived((pageNumber - 1) * pageSize);
  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  let pageNumberLabel = $derived(pageNumber.toLocaleString("en-US"));
  let totalPagesLabel = $derived(totalPages.toLocaleString("en-US"));
</script>

<nav>
  <ul>
    <li>
      {#if pageNumber > 1}
        <a href="/{route}/page/{pageNumber - 1}">Previous</a>
      {:else}
        <span>Previous</span>
      {/if}
    </li>
    <li>
      {#if pageNumber < 2}
        Showing page {pageNumberLabel} of <a href="/{route}/page/{totalPages}">{totalPagesLabel}</a>
      {:else if pageNumber < totalPages}
        Showing page <a href="/{route}">{pageNumberLabel}</a> of
        <a href="/{route}/page/{totalPages}">{totalPagesLabel}</a>
      {:else}
        Showing page <a href="/{route}/page/1">{pageNumberLabel}</a> of
        {totalPagesLabel}
      {/if}
    </li>
    {#if pageNumber < totalPages}
      <li><a href="/{route}/page/{pageNumber + 1}">Next</a></li>
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
