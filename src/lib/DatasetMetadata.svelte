<script>
  import TagList from "./TagList.svelte";
  import Timestamp from "./Timestamp.svelte";

  let { dataset } = $props();
  let tags = dataset.tags ? dataset.tags.split(/, /) : [];
</script>

<dl>
  <dt>Updated:</dt>
  <dd><Timestamp timestamp={dataset.metadata_modified} /></dd>
  <dt>Created:</dt>
  <dd><Timestamp timestamp={dataset.metadata_created} /></dd>
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
  {/if}
  {#if dataset.bureau_name}
    <dt>Bureau Name:</dt>
    <dd>
      <a href="/bureaus/id/{encodeURIComponent(dataset.bureau_code)}">{dataset.bureau_name}</a>
    </dd>
  {/if}
  {#if dataset.tags}
    <dt>Tags:</dt>
    <dd><section><TagList {tags} /></section></dd>
  {/if}
</dl>

<style lang="scss">
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

    section {
      margin-top: 0.25em;
    }
  }
  dd::after {
    content: "";
    display: block;
  }
</style>
