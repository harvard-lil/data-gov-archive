<script>
  import TagList from "$lib/TagList.svelte";

  let { data } = $props();
</script>

<h2>Tags</h2>

<TagList tags={data.tags} />
