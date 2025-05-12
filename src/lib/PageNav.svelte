<script>
  let { pageNumber, totalItems, route = "datasets" } = $props();

  let offset = $derived((pageNumber - 1) * 200);
  let totalPages = Math.ceil(totalItems / 200);

  let pageNumberLabel = $derived(pageNumber.toLocaleString("en-US"));
  let totalPagesLabel = totalPages.toLocaleString("en-US");
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
      Showing page {pageNumberLabel} of <a href="/{route}/page/{totalPages}">{totalPagesLabel}</a>
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
