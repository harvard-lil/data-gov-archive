<script>
  import { base } from "$app/paths";
  let { organizations, publishers, bureaus, tags } = $props();

  function buildEntityListUrl(entityType) {
    return `${base}/?type=${entityType}`;
  }

  function buildEntityDetailUrl(entityType, id) {
    return `${base}/?type=${entityType}&id=${encodeURIComponent(id)}`;
  }

  function buildTagUrl(tag) {
    return `${base}/?type=tag&id=${encodeURIComponent(tag)}`;
  }
</script>

<nav>
  <h2><a href={buildEntityListUrl('organization')}>Organizations</a></h2>
  <ul>
    {#each organizations as organization}
      <li>
        <a
          href={buildEntityDetailUrl('organization', organization.organization_name)}
          title={organization.organization_title}
        >
          {organization.organization_title}
        </a>
        <b>{organization.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h2><a href={buildEntityListUrl('publisher')}>Publishers</a></h2>
  <ul>
    {#each publishers as publisher}
      <li>
        <a
          href={buildEntityDetailUrl('publisher', publisher.publisher)}
          title={publisher.publisher}
        >
          {publisher.publisher}
        </a>
        <b>{publisher.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h2><a href={buildEntityListUrl('bureau')}>Bureaus</a></h2>
  <ul>
    {#each bureaus as bureau}
      <li>
        {#if bureau.bureau_name}
          <a
            href={buildEntityDetailUrl('bureau', bureau.bureau_code)}
            title={bureau.bureau_name}
          >
            {bureau.bureau_name}
          </a>
        {:else}
          <a
            href={buildEntityDetailUrl('bureau', bureau.bureau_code)}
            title={bureau.bureau_code}
          >
            {bureau.bureau_code}
          </a>
        {/if}
        <b>{bureau.count.toLocaleString("en-US")}</b>
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

        border-top: 1px dotted #222;
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

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
</style>
