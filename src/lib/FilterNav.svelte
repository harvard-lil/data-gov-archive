<script>
  let { organizations, publishers, bureaus, tags } = $props();
</script>

<nav>
  <h2><a href="/organizations">Organizations</a></h2>
  <ul>
    {#each organizations as organization}
      <li>
        <a
          href="/organizations/id/{encodeURIComponent(organization.organization_name)}"
          title={organization.organization_title}
        >
          {organization.organization_title}
        </a>
        <b>{organization.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h2><a href="/publishers">Publishers</a></h2>
  <ul>
    {#each publishers as publisher}
      <li>
        <a
          href="/publishers/id/{encodeURIComponent(publisher.publisher)}"
          title={publisher.publisher}
        >
          {publisher.publisher}
        </a>
        <b>{publisher.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h2><a href="/bureaus">Bureaus</a></h2>
  <ul>
    {#each bureaus as bureau}
      <li>
        {#if bureau.bureau_name}
          <a href="/bureaus/id/{encodeURIComponent(bureau.bureau_code)}" title={bureau.bureau_name}>
            {bureau.bureau_name}
          </a>
        {:else}
          <a href="/bureaus/id/{encodeURIComponent(bureau.bureau_code)}" title={bureau.bureau_code}>
            {bureau.bureau_code}
          </a>
        {/if}
        <b>{bureau.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h2><a href="/tags">Tags</a></h2>
  <ul>
    {#each tags as tag}
      <li>
        <a href="/tags/id/{encodeURIComponent(tag.tag)}" title={tag.tag}>
          {tag.tag}
        </a>
        <b>{tag.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  nav {
    grid-area: b;

    h2 {
      font-size: inherit;
    }

    ul {
      padding: 0;
      list-style: none;
      list-style-position: unset;

      li {
        display: flex;
        justify-content: space-between;

        border-top: 1px dotted;
        padding: 0.375em 0;

        font-size: small;

        a {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        b {
          margin-left: 0.5em;
          font-family: monospace;
        }
      }

      li:first-of-type {
        border-top: none;
        padding-top: 0;
      }
    }
    ul:last-of-type {
      li {
        a {
          font-family: monospace;
        }
      }
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
