<script>
  let { data } = $props();
</script>

<h1>Data.gov collection</h1>
<p>
  This is the Library Innovation Lab's archive of datasets from <a href="https://data.gov"
    >Data.gov</a
  >.
</p>

<ul>
  {#each data.datasets.slice(0, 100) as dataset}
    <li>
      <h2><a href="datasets/{dataset.name}">{dataset.title}</a></h2>
      <h3>
        <a href="organizations/{dataset.organization_name}">{dataset.organization_title}</a>
      </h3>
      {#if dataset.organization_title != dataset.publisher}
        <h3><a href="publishers/{dataset.publisher}">{dataset.publisher}</a></h3>
      {/if}
      <p>
        <i>{dataset.notes.slice(0, 250)} … </i>
      </p>
    </li>
  {/each}
</ul>

<style type="scss">
  :global(body) {
    margin: 0 auto;
    max-width: 42rem;
  }

  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      margin: 1em 0;
      border-top: 1px dotted;
    }
  }
</style>
