<script>
  import Timestamp from "./Timestamp.svelte";

  let { dataset } = $props();
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
    {#if dataset.bureau_code}
      <dt>Bureau Code:</dt>
      <dd>{dataset.bureau_code}</dd>
      <dt>Bureau Name:</dt>
      <dd>{dataset.bureau_name}</dd>
    {/if}
  </dl>
  <ul class="tags">
    {#each dataset.tags.split(/, /) as tag}
      <li>
        <a href="/tags/{tag}">{tag}</a>
      </li>
    {/each}
  </ul>
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

  ul.tags {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted;
      padding: 0.5em 0.75em;
      margin: 0 0.25em 0.25em 0;
      font-family: monospace;
    }
  }
</style>
