<script>
  let { data } = $props();
</script>

<h1>{data.dataset.title}</h1>
<h2>{data.dataset.organization_title}</h2>
{#if data.dataset.organization_title != data.dataset.publisher}
  <h2>{data.dataset.publisher}</h2>
{/if}
<p>{data.dataset.notes}</p>
