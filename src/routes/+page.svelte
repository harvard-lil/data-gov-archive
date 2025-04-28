<script>
  import dayjs from "dayjs";
  import sanitizeHtml from "sanitize-html";

  let { data } = $props();
</script>

<h1>Archive of Data.gov</h1>
<p>
  This is the Harvard University Library Innovation Lab's archive of <a href="https://data.gov">
    Data.gov
  </a>
  datasets. For more information, see the
  <a href="https://source.coop/repositories/harvard-lil/gov-data"> project homepage </a> or the
  <a href="https://lil.law.harvard.edu/blog/2025/02/06/announcing-data-gov-archive/">
    project announcement
  </a> on our blog.
</p>

<ul>
  {#each data.datasets.slice(0, 100) as dataset}
    <li>
      <h2><a href="datasets/{dataset.name}">{dataset.title}</a></h2>
      <h3>
        <a href="organizations/{dataset.organization_name}">{dataset.organization_title}</a>
      </h3>
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
  {/each}
</ul>

<style lang="scss">
  h1 {
    font-weight: 100;
    font-size: 3em;
  }

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
      margin: 1em 0;
      border-top: 1px dotted;

      a {
        color: inherit;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    }
  }
</style>
