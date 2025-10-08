<script>
  import { base } from "$app/paths";
  import SkipLink from "./SkipLink.svelte";

  let { organizations, publishers, bureaus, tags } = $props();

  function buildEntityListUrl(entityType) {
    const resourceMap = {
      organization: "organizations",
      bureau: "bureaus",
      publisher: "publishers",
      tag: "tags",
    };
    return `${base}/?resource=${resourceMap[entityType]}`;
  }

  function buildEntityDetailUrl(entityType, id) {
    const resourceMap = {
      organization: "organizations",
      bureau: "bureaus",
      publisher: "publishers",
      tag: "tags",
    };
    return `${base}/?resource=${resourceMap[entityType]}/${encodeURIComponent(id)}`;
  }

  function buildTagUrl(tag) {
    return `${base}/?resource=tags/${encodeURIComponent(tag)}`;
  }
</script>

<nav id="filters" aria-label="Filters">
  <h2 class="sr-only">Filters</h2>

  <h3><a href={buildEntityListUrl("organization")}>Organizations</a></h3>
  <ul>
    {#each organizations as organization}
      <li>
        <a
          href={buildEntityDetailUrl("organization", organization.organization_title)}
          title={organization.organization_title}
        >
          {organization.organization_title}
        </a>
        <b>{organization.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h3><a href={buildEntityListUrl("publisher")}>Publishers</a></h3>
  <ul>
    {#each publishers as publisher}
      <li>
        <a
          href={buildEntityDetailUrl("publisher", publisher.publisher)}
          title={publisher.publisher}
        >
          {publisher.publisher}
        </a>
        <b>{publisher.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ul>

  <h3><a href={buildEntityListUrl("bureau")}>Bureaus</a></h3>
  <ul>
    {#each bureaus as bureau}
      <li>
        <a href={buildEntityDetailUrl("bureau", bureau.bureau_name)} title={bureau.bureau_name}>
          {bureau.bureau_name}
        </a>
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
