<script>
  import DatasetList from "$lib/DatasetList.svelte";
  import DatasetListItem from "$lib/DatasetListItem.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();

  let bureauLabel = $derived(
    data.bureau_name ? `${data.bureau_name} (${data.bureau_code})` : data.bureau_code
  );
</script>

<svelte:head>
  <title>Archive of Data.gov: {bureauLabel}, page {data.pageNumber}</title>
</svelte:head>

<h2>
  <b>Bureau:</b> <a href="/bureaus/id/{encodeURIComponent(data.bureau_code)}">{bureauLabel}</a>
</h2>

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="bureaus/id/{encodeURIComponent(data.bureau_code)}"
/>

<DatasetList datasets={data.datasets} />

<PageNav
  pageNumber={data.pageNumber}
  totalItems={data.totalItems}
  route="bureaus/id/{encodeURIComponent(data.bureau_code)}"
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
