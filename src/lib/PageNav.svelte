<script>
  let { pageNumber, totalItems, itemsPerPage = 200, route = "datasets" } = $props();

  let offset = (pageNumber - 1) * itemsPerPage;
  let totalPages = Math.ceil(totalItems / itemsPerPage);
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
    <li>Showing page {pageNumber} of {totalPages}</li>
    <li><a href="/{route}/page/{pageNumber + 1}">Next</a></li>
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
</style>
