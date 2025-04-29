<script>
  import TagList from "./TagList.svelte";
  import Timestamp from "./Timestamp.svelte";

  let { dataset } = $props();
  let tags = dataset.tags ? dataset.tags.split(/, /) : [];
</script>

<article>
  <h2>{dataset.title}</h2>
  <h3><a href="/organizations/{dataset.organization_name}">{dataset.organization_title}</a></h3>
  <p>
    <i>
      {#each dataset.notes.split(/\r\n|\r|\n/) as line}
        {line}<br />
      {/each}
    </i>
  </p>
  <dl>
    <dt>Created:</dt>
    <dd><Timestamp timestamp={dataset.metadata_created} /></dd>
    <dt>Updated:</dt>
    <dd><Timestamp timestamp={dataset.metadata_modified} /></dd>
    {#if dataset.publisher}
      <dt>Publisher:</dt>
      <dd>{dataset.publisher}</dd>
    {/if}
    {#if dataset.bureau_code}
      <dt>Bureau Code:</dt>
      <dd>{dataset.bureau_code}</dd>
      <dt>Bureau Name:</dt>
      <dd>{dataset.bureau_name}</dd>
    {/if}
  </dl>
  <TagList {tags} />
</article>

<style lang="scss">
  h2 {
    font-weight: 700;
  }

  h3 {
    font-weight: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  dt {
    font-weight: bold;
    display: inline;
  }

  dd {
    margin-left: 0;
    display: inline;
  }
  dd::after {
    content: "";
    display: block;
  }
</style>
