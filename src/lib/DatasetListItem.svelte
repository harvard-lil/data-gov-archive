<script>
  import dayjs from "dayjs";
  import sanitizeHtml from "sanitize-html";

  let { dataset, showOrganization = true } = $props();
</script>

<li>
  <h2><a href="/datasets/{dataset.name}">{dataset.title}</a></h2>
  {#if showOrganization === true}
    <h3>
      <a href="/organizations/{dataset.organization_name}">{dataset.organization_title}</a>
    </h3>
  {/if}
  <p>
    <i>
      {sanitizeHtml(dataset.notes.slice(0, 320), {
        allowedTags: [],
      })}{#if dataset.notes.length > 320}…{/if}
    </i>
  </p>
  <p>
    <b>Updated:</b>
    <time datetime={dataset.metadata_modified}>
      <!-- This will display the date in the user's local time zone -->
      {dayjs(dataset.metadata_modified).format("MMMM D, YYYY [at] h:mm a")}
    </time>
  </p>
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

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
</style>
