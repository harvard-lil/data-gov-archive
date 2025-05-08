<script>
  import TagList from "$lib/TagList.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: Tags</title>
</svelte:head>

<h2>Tags</h2>
<TagList tags={data.tags} />
