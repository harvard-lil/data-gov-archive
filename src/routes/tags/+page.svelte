<script>
  import PageNav from "$lib/PageNav.svelte";
  import TagList from "$lib/TagList.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: Tags</title>
</svelte:head>

<h2>Tags</h2>

<PageNav pageNumber={1} totalItems={data.totalItems} route="tags" pageSize={1000} />

<TagList tags={data.tags} />

<PageNav pageNumber={1} totalItems={data.totalItems} route="tags" pageSize={1000} />
