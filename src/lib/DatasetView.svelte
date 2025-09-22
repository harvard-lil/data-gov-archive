<script>
  import "@fontsource/material-icons";
  import sanitizeHtml from "sanitize-html";
  import { base } from "$app/paths";

  import DatasetMetadata from "./DatasetMetadata.svelte";
  import TagList from "./TagList.svelte";
  import DatasetLinks from "./DatasetLinks.svelte";

  let { dataset } = $props();
  let notes = sanitizeHtml(dataset.notes, { allowedTags: [] });
</script>

<article>
  <h2>{dataset.title}</h2>
  <h3>
    <a href={`${base}/organizations/${dataset.organization_name}`}>{dataset.organization_title}</a>
  </h3>

  <DatasetLinks {dataset} />

  <p>
    {#each notes.split(/\r\n|\r|\n/) as line}
      {line}<br />
    {/each}
  </p>

  <DatasetMetadata {dataset} />
</article>

<style lang="scss">
  h2 {
    font-weight: 700;
  }

  h3 {
    font-weight: inherit;
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
</style>
