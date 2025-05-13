<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.publisher}, page {data.pageNumber}</title>
</svelte:head>

<h2>
  <b>Publisher:</b>
  <a href="/publishers/id/{encodeURIComponent(data.publisher)}">{data.publisher}</a>
</h2>

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="publishers/id/{encodeURIComponent(data.publisher)}"
/>

<DatasetList datasets={data.datasets} />

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="publishers/id/{encodeURIComponent(data.publisher)}"
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
  }
</style>
