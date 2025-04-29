<script>
  import TagList from "./TagList.svelte";
  import Timestamp from "./Timestamp.svelte";

  let { dataset } = $props();
  let tags = dataset.tags ? dataset.tags.split(/, /) : [];
</script>

<article>
  <h2>{dataset.title}</h2>
  <h3><a href="/organizations/id/{dataset.organization_name}">{dataset.organization_title}</a></h3>

  <p>
    {#each dataset.notes.split(/\r\n|\r|\n/) as line}
      {line}<br />
    {/each}
  </p>

  <nav>
    <ul>
      <li>
        <a href="https://source.coop/harvard-lil/gov-data/collections/data_gov/{dataset.name}">
          View Collection Archive
        </a>
      </li>
      <li>
        <a href="https://source.coop/harvard-lil/gov-data/metadata/data_gov/{dataset.name}">
          View Metadata Archive
        </a>
      </li>
      <li>
        <a href="https://catalog.data.gov/dataset/{dataset.name}">View Source on Data.gov</a>
      </li>
    </ul>
  </nav>

  <dl>
    <dt>Created:</dt>
    <dd><Timestamp timestamp={dataset.metadata_created} /></dd>
    <dt>Updated:</dt>
    <dd><Timestamp timestamp={dataset.metadata_modified} /></dd>
    {#if dataset.publisher}
      <dt>Publisher:</dt>
      <dd>
        <a href="/publishers/id/{encodeURIComponent(dataset.publisher)}">{dataset.publisher}</a>
      </dd>
    {/if}
    {#if dataset.bureau_code}
      <dt>Bureau Code:</dt>
      <dd>
        <a href="/bureaus/id/{encodeURIComponent(dataset.bureau_code)}">{dataset.bureau_code}</a>
      </dd>
      <dt>Bureau Name:</dt>
      <dd>
        <a href="/bureaus/id/{encodeURIComponent(dataset.bureau_code)}">{dataset.bureau_name}</a>
      </dd>
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

  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      display: inline-block;
      margin: 0.125em 0;
      padding: 0.75em 1em;
      background-color: #ccc;
      color: #333;
      border-radius: 0.25em;
      border: 1px dotted;
    }
  }

  article > p {
    font-style: italic;
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
