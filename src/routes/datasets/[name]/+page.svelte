<script>
  let { data } = $props();
</script>

<article>
  <h1>{data.dataset.title}</h1>
  <h2>{data.dataset.organization_title}</h2>
  {#if data.dataset.organization_title != data.dataset.publisher}
    <h2>{data.dataset.publisher}</h2>
  {/if}
  <p>
    {#each data.dataset.notes.split(/\r\n|\r|\n/) as line}
      {line}<br />
    {/each}
  </p>
</article>
