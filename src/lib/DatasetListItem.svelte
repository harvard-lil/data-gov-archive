<script>
  import sanitizeHtml from "sanitize-html";

  import Timestamp from "./Timestamp.svelte";

  let { dataset, showOrganization = true } = $props();
</script>

<li>
  <h2><a href="/datasets/id/{dataset.name}">{dataset.title}</a></h2>
  {#if showOrganization === true}
    <h3>
      <a href="/organizations/id/{dataset.organization_name}">{dataset.organization_title}</a>
    </h3>
  {/if}
  <p>
    {sanitizeHtml(dataset.notes.slice(0, 320), {
      allowedTags: [],
    })}{#if dataset.notes.length > 320}&nbsp;…{/if}
  </p>
  <dl>
    <dt>Updated:</dt>
    <dd>
      <Timestamp timestamp={dataset.metadata_modified} />
    </dd>
  </dl>
</li>

<style lang="scss">
  li {
    margin: 1em 0;
    border-top: 1px dotted;

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
  }
  li:first-of-type {
    border-top: none;
  }
</style>
