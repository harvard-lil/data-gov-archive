<script>
  import { base } from "$app/paths";
  import TagList from "./TagList.svelte";
  import Timestamp from "./Timestamp.svelte";

  let { dataset } = $props();
</script>

<dl>
  <!-- <dt>Metadata Modified:</dt>
  <dd><Timestamp timestamp={dataset.metadata_modified} /></dd> -->
  {#if dataset.publisher}
    <dt>Publisher:</dt>
    <dd>
      <a href={`${base}/?resource=publishers/${encodeURIComponent(dataset.publisher)}`}
        >{dataset.publisher}</a
      >
    </dd>
  {/if}
  {#if dataset.bureau_name}
    <dt>Bureau:</dt>
    <dd>
      <a href={`${base}/?resource=bureaus/${encodeURIComponent(dataset.bureau_name)}`}
        >{dataset.bureau_name}</a
      >
    </dd>
  {/if}
  {#if dataset.tags && dataset.tags.length > 0}
    <dt>Tags:</dt>
    <dd><section><TagList tags={dataset.tags} /></section></dd>
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
