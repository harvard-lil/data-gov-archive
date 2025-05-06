<script>
  let { organizations, publishers, bureaus, tags } = $props();
</script>

<nav>
  <h2>Organizations</h2>
  <ul>
    {#each organizations as organization}
      <li>
        <a
          href="/organizations/id/{encodeURIComponent(organization.organization_name)}"
          title={organization.organization_title}
        >
          {organization.organization_title}
        </a>
        <b>{organization.count}</b>
      </li>
    {/each}
  </ul>

  <h2>Publishers</h2>
  <ul>
    {#each publishers as publisher}
      <li>
        <a
          href="/publishers/id/{encodeURIComponent(publisher.publisher)}"
          title={publisher.publisher}
        >
          {publisher.publisher}
        </a>
        <b>{publisher.count}</b>
      </li>
    {/each}
  </ul>

  <h2>Bureaus</h2>
  <ul>
    {#each bureaus as bureau}
      <li>
        <a href="/bureaus/id/{encodeURIComponent(bureau.bureau_code)}" title={bureau.bureau_name}>
          {bureau.bureau_name}
        </a>
        <b>{bureau.count}</b>
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
        <b>{tag.count}</b>
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
        border-top: 1px dotted;
        padding: 0.375em 0;

        font-size: small;

        text-wrap-mode: nowrap;
        text-wrap-style: pretty;
        overflow: hidden;
        text-overflow: nowrap;
        text-overflow: ellipsis;
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
