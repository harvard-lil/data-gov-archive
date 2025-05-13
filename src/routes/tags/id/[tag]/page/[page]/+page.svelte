<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.tag}, page {data.pageNumber}</title>
</svelte:head>

<h2>
  <b>Tag:</b>
  <span class="tag"><a href="/tags/id/{encodeURIComponent(data.tag)}">{data.tag}</a></span>
</h2>

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="tags/id/{encodeURIComponent(data.tag)}"
/>

<DatasetList datasets={data.datasets} />

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="tags/id/{encodeURIComponent(data.tag)}"
/>

<style lang="scss">
  h2 {
    font-weight: inherit;

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    span.tag {
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted;
      margin-left: 0.25em;
      padding: 0.5em 0.75em;

      font-family: monospace;
      font-weight: 400;
    }
  }
</style>
