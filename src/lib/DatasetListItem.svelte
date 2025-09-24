<script>
  import sanitizeHtml from "sanitize-html";
  import { base } from "$app/paths";

  import Timestamp from "./Timestamp.svelte";

  let { dataset, showOrganization = true } = $props();
</script>

<li>
  <h2><a href={`${base}/datasets/${encodeURIComponent(dataset.name)}`}>{dataset.title}</a></h2>
  {#if showOrganization === true}
    <h3>
      <a href={`${base}/organizations/${encodeURIComponent(dataset.organization_name)}`}
        >{dataset.organization_title}</a
      >
    </h3>
  {/if}
  <p>
    {sanitizeHtml(dataset.notes.slice(0, 320), {
      allowedTags: [],
    })}{#if dataset.notes.length > 320}&nbsp;…{/if}
  </p>
</li>

<style lang="scss">
  li {
    margin: 1em 0;
    border-top: 1px dotted #222;

    h2 {
      font-weight: 700;
    }

    h3 {
      font-weight: inherit;
    }

    p {
      font-style: italic;
    }

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
  li:last-of-type {
    padding-bottom: 0.5em;
  }
</style>
