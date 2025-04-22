<script>
  let { data } = $props();
</script>

<h1>{data.organization_title}</h1>

{#each data.datasets as dataset}
  <h2>{dataset.title}</h2>
{/each}
