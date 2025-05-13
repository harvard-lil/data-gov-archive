<script>
  import PageNav from "$lib/PageNav.svelte";
  import TagList from "$lib/TagList.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: Tags, page {data.pageNumber}</title>
</svelte:head>

<h2>Tags</h2>

<PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} route="tags" pageSize={500} />

<TagList tags={data.tags} />

<PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} route="tags" pageSize={500} />
